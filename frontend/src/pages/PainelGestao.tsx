import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchComunicados, criarComunicado } from '../services/api';
import { Comunicado } from '../components/ComunicadoCard';
import './PainelGestao.css';

export function PainelGestao() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    corpo_texto: '',
    nivel_urgencia: 'baixa',
    id_turma_destino: '00000000-0000-0000-0000-000000000000' // Mock turma_id for now
  });

  const { data, isLoading } = useQuery({
    queryKey: ['comunicados-admin'],
    queryFn: () => fetchComunicados(1),
  });

  const createMutation = useMutation({
    mutationFn: criarComunicado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunicados-admin'] });
      setIsCreating(false);
      setFormData({ titulo: '', corpo_texto: '', nivel_urgencia: 'baixa', id_turma_destino: '00000000-0000-0000-0000-000000000000' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="painel-container">
      <header className="painel-header">
        <h2>Painel de Gestão - Comunicados</h2>
        <button className="btn-primary" onClick={() => setIsCreating(true)}>
          + Novo Comunicado
        </button>
      </header>

      {isCreating && (
        <div className="form-card">
          <h3>Criar Novo Comunicado</h3>
          <form onSubmit={handleSubmit} className="comunicado-form">
            <div className="form-group">
              <label>Título</label>
              <input 
                type="text" 
                required 
                value={formData.titulo}
                onChange={e => setFormData({...formData, titulo: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Urgência</label>
              <select 
                value={formData.nivel_urgencia}
                onChange={e => setFormData({...formData, nivel_urgencia: e.target.value})}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div className="form-group">
              <label>Mensagem</label>
              <textarea 
                rows={5} 
                required
                value={formData.corpo_texto}
                onChange={e => setFormData({...formData, corpo_texto: e.target.value})}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsCreating(false)}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Salvando...' : 'Publicar Comunicado'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-list">
        <h3>Comunicados Recentes</h3>
        {isLoading ? <p>Carregando...</p> : (
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
              {data?.data?.map((c: Comunicado) => (
                <tr key={c.id}>
                  <td>{c.titulo}</td>
                  <td>{new Date(c.data_criacao).toLocaleDateString()}</td>
                  <td><span className={`tag-${c.nivel_urgencia}`}>{c.nivel_urgencia}</span></td>
                  <td>
                    <button className="btn-icon">✏️</button>
                    <button className="btn-icon delete">🗑️</button>
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
