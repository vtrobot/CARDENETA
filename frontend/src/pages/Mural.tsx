import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchComunicados, confirmarCienciaComunicado, fetchComunicadoById } from '../services/api';
import { ComunicadoCard, Comunicado } from '../components/ComunicadoCard';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import './Mural.css';

export function Mural() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['comunicados'],
    queryFn: () => fetchComunicados(1),
  });

  const cienciaMutation = useMutation({
    mutationFn: confirmarCienciaComunicado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunicados'] });
      setSelectedComunicado(null);
    },
  });

  const handleCardClick = async (comunicado: Comunicado) => {
    setSelectedComunicado(comunicado);
    // Dispara a leitura se não for alta urgência
    if (comunicado.nivel_urgencia !== 'alta') {
      try {
         await fetchComunicadoById(comunicado.id);
         queryClient.invalidateQueries({ queryKey: ['comunicados'] });
      } catch(e) { console.error("Erro ao marcar como lido", e) }
    }
  };

  const isPendingCiencia = selectedComunicado?.nivel_urgencia === 'alta' && 
    (!selectedComunicado.leituras_comunicados || !selectedComunicado.leituras_comunicados[0]?.ciencia_confirmada);

  const handleTirarDuvida = () => {
    if (!selectedComunicado) return;
    navigate('/mensagens', {
      state: {
        presetDestinatario: selectedComunicado.autor_id,
        presetNome: 'Autor do Comunicado',
        comunicadoOrigem: selectedComunicado.id
      }
    });
  };

  if (isLoading) return <div className="page-loading">Carregando mural...</div>;
  if (error) return <div className="page-error">Erro ao carregar comunicados.</div>;

  return (
    <div className="mural-container">
      <header className="mural-header">
        <h2>Mural de Comunicados</h2>
        <p>Acompanhe aqui as atualizações enviadas pela escola.</p>
        {/* Aqui entrariam os filtros F3: por aluno/status */}
      </header>

      <div className="comunicados-list">
        {data?.data?.map((comunicado: Comunicado) => (
          <ComunicadoCard 
            key={comunicado.id} 
            comunicado={comunicado} 
            onClick={handleCardClick} 
          />
        ))}
        {(!data?.data || data.data.length === 0) && (
          <p className="empty-state">Nenhum comunicado no momento.</p>
        )}
      </div>

      {selectedComunicado && (
        <div className="modal-overlay" onClick={() => setSelectedComunicado(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedComunicado.titulo}</h3>
              <button className="btn-close" onClick={() => setSelectedComunicado(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p>{selectedComunicado.corpo_texto}</p>
            </div>
            <div className={`modal-footer ${isPendingCiencia ? 'action-required' : 'standard'}`}>
              {isPendingCiencia ? (
                <>
                  <p className="warning-text">Este comunicado requer confirmação de ciência.</p>
                  <button 
                    className="btn-primary btn-ciencia"
                    onClick={() => cienciaMutation.mutate(selectedComunicado.id)}
                    disabled={cienciaMutation.isPending}
                  >
                    {cienciaMutation.isPending ? 'Confirmando...' : 'Confirmar Ciência'}
                  </button>
                </>
              ) : (
                <button className="btn-secondary btn-duvida" onClick={handleTirarDuvida}>
                  <MessageSquare size={16} /> Tirar Dúvida
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
