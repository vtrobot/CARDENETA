import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAlunosAdmin, createAlunoAdmin, fetchUsuariosByPapel, fetchVinculosAluno, createVinculoAluno, deleteVinculoAluno } from '../../services/api';

interface AlunosTabProps {
  turmas: any[] | undefined;
}

export function AlunosTab({ turmas }: AlunosTabProps) {
  const queryClient = useQueryClient();
  const [isCreatingAluno, setIsCreatingAluno] = useState(false);
  const [alunoForm, setAlunoForm] = useState({ nome: '', matricula: '', data_nascimento: '', turma_id: '' });
  
  // Filtro por turma
  const [filtroTurma, setFiltroTurma] = useState('');

  // VÍNCULO RESPONSÁVEL STATE
  const [selectedAlunoForVinculo, setSelectedAlunoForVinculo] = useState<any>(null);
  const [isManagingVinculos, setIsManagingVinculos] = useState(false);
  const [newVinculoForm, setNewVinculoForm] = useState({ responsavel_id: '', grau_parentesco: 'Pai' });

  const { data: alunos, isLoading: loadingAlunos } = useQuery({
    queryKey: ['admin-alunos'],
    queryFn: fetchAlunosAdmin,
  });

  const { data: responsaveis } = useQuery({
    queryKey: ['admin-responsaveis'],
    queryFn: () => fetchUsuariosByPapel('responsavel'),
  });

  const { data: vinculosAluno, refetch: refetchVinculos } = useQuery({
    queryKey: ['vinculos-aluno', selectedAlunoForVinculo?.id],
    queryFn: () => fetchVinculosAluno(selectedAlunoForVinculo.id),
    enabled: !!selectedAlunoForVinculo && isManagingVinculos,
  });

  const createAlunoMutation = useMutation({
    mutationFn: createAlunoAdmin,
    onSuccess: () => {
      alert("Aluno cadastrado com sucesso!");
      setIsCreatingAluno(false);
      setAlunoForm({ nome: '', matricula: '', data_nascimento: '', turma_id: '' });
      queryClient.invalidateQueries({ queryKey: ['admin-alunos'] });
    },
    onError: (err: any) => {
      alert("Erro ao cadastrar aluno: " + err.message);
    }
  });

  const createVinculoAlunoMutation = useMutation({
    mutationFn: (data: any) => createVinculoAluno(data),
    onSuccess: () => {
      refetchVinculos();
      setNewVinculoForm({ responsavel_id: '', grau_parentesco: 'Pai' });
    },
    onError: (err: any) => alert("Erro ao vincular: " + err.message)
  });

  const deleteVinculoAlunoMutation = useMutation({
    mutationFn: (id: string) => deleteVinculoAluno(id),
    onSuccess: () => refetchVinculos(),
    onError: (err: any) => alert("Erro ao remover vínculo: " + err.message)
  });

  // Lógica de filtragem
  const filteredAlunos = useMemo(() => {
    if (!alunos) return [];
    if (!filtroTurma) return alunos;
    return alunos.filter((a: any) => a.turma_id === filtroTurma);
  }, [alunos, filtroTurma]);

  return (
    <div className="subtab-content">
      <div className="content-header">
        <h3>Gestão de Alunos</h3>
        <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="filter-group" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label htmlFor="filtro-turma">Filtrar por Turma:</label>
            <select 
              id="filtro-turma"
              value={filtroTurma} 
              onChange={(e) => setFiltroTurma(e.target.value)}
              className="select-filter"
              style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            >
              <option value="">Todas as Turmas</option>
              {turmas?.map((t: any) => (
                <option key={t.id} value={t.id}>{t.nome} ({t.turno})</option>
              ))}
            </select>
          </div>
          <button className="btn-primary" onClick={() => setIsCreatingAluno(true)}>
            + Cadastrar Aluno
          </button>
        </div>
      </div>

      {isCreatingAluno && (
        <div className="form-card" style={{ maxWidth: '600px' }}>
          <h3>Cadastrar Novo Aluno</h3>
          <form onSubmit={e => { e.preventDefault(); createAlunoMutation.mutate(alunoForm); }} className="comunicado-form">
            <div className="form-group">
              <label htmlFor="aluno-nome">Nome Completo</label>
              <input 
                id="aluno-nome"
                type="text" 
                required 
                value={alunoForm.nome} 
                onChange={e => setAlunoForm({...alunoForm, nome: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="aluno-mat">Matrícula</label>
              <input 
                id="aluno-mat"
                type="text" 
                required 
                value={alunoForm.matricula} 
                onChange={e => setAlunoForm({...alunoForm, matricula: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="aluno-nasc">Data de Nascimento</label>
              <input 
                id="aluno-nasc"
                type="date" 
                required 
                value={alunoForm.data_nascimento} 
                onChange={e => setAlunoForm({...alunoForm, data_nascimento: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="aluno-turma">Turma</label>
              <select 
                id="aluno-turma"
                value={alunoForm.turma_id} 
                onChange={e => setAlunoForm({...alunoForm, turma_id: e.target.value})}
              >
                <option value="">Selecione uma turma...</option>
                {turmas?.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.nome} ({t.turno})</option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsCreatingAluno(false)}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={createAlunoMutation.isPending}>
                {createAlunoMutation.isPending ? 'Cadastrando...' : 'Cadastrar Aluno'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-list">
        {loadingAlunos ? <p>Carregando...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Matrícula</th>
                <th>Turma</th>
                <th>Nascimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlunos?.map((a: any) => (
                <tr key={a.id}>
                  <td>{a.nome}</td>
                  <td>{a.matricula}</td>
                  <td>{a.turmas?.nome || 'Sem Turma'}</td>
                  <td>{new Date(a.data_nascimento).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn-icon" 
                        title="Gerenciar Responsáveis"
                        aria-label="Gerenciar responsáveis"
                        onClick={() => { setSelectedAlunoForVinculo(a); setIsManagingVinculos(true); }}
                      >
                        🔗
                      </button>
                      <button 
                        className="btn-icon" 
                        title="Enviar Mensagem ao Responsável"
                        aria-label="Enviar mensagem ao responsável"
                      >
                        💬
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filteredAlunos?.length === 0 && !loadingAlunos && (
          <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b' }}>Nenhum aluno encontrado.</p>
        )}
      </div>

      {/* MODAL GERENCIAR RESPONSÁVEIS */}
      {isManagingVinculos && selectedAlunoForVinculo && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px', width: '90%' }}>
            <div className="modal-header">
              <h3>Responsáveis: {selectedAlunoForVinculo.nome}</h3>
              <button className="btn-close" onClick={() => setIsManagingVinculos(false)} aria-label="Fechar modal">×</button>
            </div>
            
            <div className="vinculos-current">
              <h4>Vínculos Atuais</h4>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Parentesco</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {vinculosAluno?.map((v: any) => (
                    <tr key={v.id}>
                      <td>{v.usuarios?.nome}</td>
                      <td>{v.grau_parentesco}</td>
                      <td>
                        <button 
                          className="btn-icon delete" 
                          aria-label="Remover vínculo"
                          onClick={() => { if(confirm('Remover este vínculo?')) deleteVinculoAlunoMutation.mutate(v.id); }}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!vinculosAluno || vinculosAluno.length === 0) && (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center', padding: '1rem' }}>Nenhum responsável vinculado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="vinculo-new" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
              <h4>Vincular Novo Responsável</h4>
              <form 
                className="comunicado-form" 
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}
                onSubmit={(e) => {
                  e.preventDefault();
                  createVinculoAlunoMutation.mutate({
                    aluno_id: selectedAlunoForVinculo.id,
                    responsavel_id: newVinculoForm.responsavel_id,
                    grau_parentesco: newVinculoForm.grau_parentesco
                  });
                }}
              >
                <div className="form-group">
                  <label htmlFor="vinc-resp">Responsável</label>
                  <select 
                    id="vinc-resp"
                    required 
                    value={newVinculoForm.responsavel_id} 
                    onChange={e => setNewVinculoForm({...newVinculoForm, responsavel_id: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    {responsaveis?.map((r: any) => (
                      <option key={r.id} value={r.id}>{r.nome} ({r.email})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="vinc-parent">Parentesco</label>
                  <input 
                    id="vinc-parent"
                    type="text" 
                    required 
                    placeholder="Ex: Pai, Mãe, Tia..." 
                    value={newVinculoForm.grau_parentesco} 
                    onChange={e => setNewVinculoForm({...newVinculoForm, grau_parentesco: e.target.value})} 
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ marginBottom: '0.5rem' }} disabled={createVinculoAlunoMutation.isPending}>
                  {createVinculoAlunoMutation.isPending ? '...' : 'Vincular'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
