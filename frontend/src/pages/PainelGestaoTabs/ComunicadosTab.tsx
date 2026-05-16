import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchComunicados, criarComunicado } from '../../services/api';
import { Comunicado } from '../../components/ComunicadoCard';

interface ComunicadosTabProps {
  turmas: any[] | undefined;
}

export function ComunicadosTab({ turmas }: ComunicadosTabProps) {
  const queryClient = useQueryClient();
  const [isCreatingComunicado, setIsCreatingComunicado] = useState(false);
  const [comunicadoForm, setComunicadoForm] = useState({
    titulo: '', corpo_texto: '', nivel_urgencia: 'baixa', id_turma_destino: '00000000-0000-0000-0000-000000000000'
  });

  const { data: comunicados, isLoading: loadingCom } = useQuery({
    queryKey: ['comunicados-admin'],
    queryFn: () => fetchComunicados(1),
  });

  const createComMutation = useMutation({
    mutationFn: criarComunicado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunicados-admin'] });
      setIsCreatingComunicado(false);
      setComunicadoForm({ titulo: '', corpo_texto: '', nivel_urgencia: 'baixa', id_turma_destino: '00000000-0000-0000-0000-000000000000' });
    },
  });

  return (
    <div className="tab-content">
      <div className="content-header">
        <h3>Gerenciar Comunicados</h3>
        <button className="btn-primary" onClick={() => setIsCreatingComunicado(true)}>
          + Novo Comunicado
        </button>
      </div>

      {isCreatingComunicado && (
        <div className="form-card">
          <h3>Criar Novo Comunicado</h3>
          <form onSubmit={e => { e.preventDefault(); createComMutation.mutate(comunicadoForm); }} className="comunicado-form">
            <div className="form-group">
              <label htmlFor="com-titulo">Título</label>
              <input 
                id="com-titulo"
                type="text" 
                required 
                value={comunicadoForm.titulo} 
                onChange={e => setComunicadoForm({...comunicadoForm, titulo: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="com-urgencia">Urgência</label>
              <select 
                id="com-urgencia"
                value={comunicadoForm.nivel_urgencia} 
                onChange={e => setComunicadoForm({...comunicadoForm, nivel_urgencia: e.target.value})}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="com-turma">Turma Destino</label>
              <select 
                id="com-turma"
                required 
                value={comunicadoForm.id_turma_destino} 
                onChange={e => setComunicadoForm({...comunicadoForm, id_turma_destino: e.target.value})}
              >
                <option value="">Selecione uma turma...</option>
                {turmas?.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.nome} ({t.turno})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="com-mensagem">Mensagem</label>
              <textarea 
                id="com-mensagem"
                rows={5} 
                required 
                value={comunicadoForm.corpo_texto} 
                onChange={e => setComunicadoForm({...comunicadoForm, corpo_texto: e.target.value})} 
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsCreatingComunicado(false)}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={createComMutation.isPending}>
                {createComMutation.isPending ? 'Salvando...' : 'Publicar Comunicado'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-list">
        {loadingCom ? <p>Carregando...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Data</th>
                <th>Urgência</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {comunicados?.data?.map((c: Comunicado) => (
                <tr key={c.id}>
                  <td>{c.titulo}</td>
                  <td>{new Date(c.data_criacao).toLocaleDateString()}</td>
                  <td><span className={`tag-${c.nivel_urgencia}`}>{c.nivel_urgencia}</span></td>
                  <td>
                    <button className="btn-icon" aria-label="Editar comunicado">✏️</button>
                    <button className="btn-icon delete" aria-label="Excluir comunicado">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
