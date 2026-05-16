import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTurmasAdmin, createTurmaAdmin, fetchUsuariosByPapel, createVinculoProfTurma } from '../../services/api';

export function TurmasTab() {
  const queryClient = useQueryClient();
  const [isCreatingTurma, setIsCreatingTurma] = useState(false);
  const [turmaForm, setTurmaForm] = useState({ nome: '', turno: 'manha', ano_letivo: new Date().getFullYear() });
  const [isCreatingVinculo, setIsCreatingVinculo] = useState(false);
  const [vinculoForm, setVinculoForm] = useState({ professor_id: '', turma_id: '' });

  const { data: turmas, isLoading: loadingTurmas } = useQuery({
    queryKey: ['admin-turmas'],
    queryFn: fetchTurmasAdmin,
  });

  const { data: professores } = useQuery({
    queryKey: ['admin-professores'],
    queryFn: () => fetchUsuariosByPapel('professor'),
  });

  const createTurmaMutation = useMutation({
    mutationFn: createTurmaAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-turmas'] });
      setIsCreatingTurma(false);
      setTurmaForm({ nome: '', turno: 'manha', ano_letivo: new Date().getFullYear() });
    },
    onError: (err: any) => {
      alert("Erro ao criar turma: " + err.message);
    }
  });

  const createVinculoMutation = useMutation({
    mutationFn: (data: { professor_id: string, turma_id: string }) => createVinculoProfTurma(data.professor_id, data.turma_id),
    onSuccess: () => {
      alert("Professor vinculado com sucesso!");
      setIsCreatingVinculo(false);
      setVinculoForm({ professor_id: '', turma_id: '' });
    },
    onError: (err: any) => {
      alert("Erro ao vincular: " + err.message);
    }
  });

  return (
    <div className="subtab-content">
      <div className="content-header">
        <h3>Gestão de Turmas</h3>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setIsCreatingVinculo(true)}>
            🔗 Vincular Professor
          </button>
          <button className="btn-primary" onClick={() => setIsCreatingTurma(true)}>
            + Nova Turma
          </button>
        </div>
      </div>

      {isCreatingTurma && (
        <div className="form-card">
          <h3>Cadastrar Turma</h3>
          <form onSubmit={e => { e.preventDefault(); createTurmaMutation.mutate(turmaForm); }} className="comunicado-form">
            <div className="form-group">
              <label htmlFor="turma-nome">Nome da Turma</label>
              <input 
                id="turma-nome"
                type="text" 
                required 
                placeholder="Ex: Pré-escola 1" 
                value={turmaForm.nome} 
                onChange={e => setTurmaForm({...turmaForm, nome: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="turma-turno">Turno</label>
              <select 
                id="turma-turno"
                value={turmaForm.turno} 
                onChange={e => setTurmaForm({...turmaForm, turno: e.target.value})}
              >
                <option value="manha">Manhã</option>
                <option value="tarde">Tarde</option>
                <option value="integral">Integral</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="turma-ano">Ano Letivo</label>
              <input 
                id="turma-ano"
                type="number" 
                required 
                value={turmaForm.ano_letivo} 
                onChange={e => setTurmaForm({...turmaForm, ano_letivo: parseInt(e.target.value)})} 
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsCreatingTurma(false)}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={createTurmaMutation.isPending}>
                {createTurmaMutation.isPending ? 'Salvando...' : 'Salvar Turma'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isCreatingVinculo && (
        <div className="form-card">
          <h3>Vincular Professor à Turma</h3>
          <form onSubmit={e => { e.preventDefault(); createVinculoMutation.mutate(vinculoForm); }} className="comunicado-form">
            <div className="form-group">
              <label htmlFor="vinc-prof">Professor</label>
              <select 
                id="vinc-prof"
                required 
                value={vinculoForm.professor_id} 
                onChange={e => setVinculoForm({...vinculoForm, professor_id: e.target.value})}
              >
                <option value="">Selecione...</option>
                {professores?.map((p: any) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="vinc-turma">Turma</label>
              <select 
                id="vinc-turma"
                required 
                value={vinculoForm.turma_id} 
                onChange={e => setVinculoForm({...vinculoForm, turma_id: e.target.value})}
              >
                <option value="">Selecione...</option>
                {turmas?.map((t: any) => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsCreatingVinculo(false)}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={createVinculoMutation.isPending}>
                {createVinculoMutation.isPending ? 'Vinculando...' : 'Vincular'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-list">
        {loadingTurmas ? <p>Carregando...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Turno</th>
                <th>Ano Letivo</th>
                <th>Criada em</th>
              </tr>
            </thead>
            <tbody>
              {turmas?.map((t: any) => (
                <tr key={t.id}>
                  <td>{t.nome}</td>
                  <td>{t.turno === 'manha' ? 'Manhã' : t.turno === 'tarde' ? 'Tarde' : 'Integral'}</td>
                  <td>{t.ano_letivo}</td>
                  <td>{new Date(t.criado_em).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
