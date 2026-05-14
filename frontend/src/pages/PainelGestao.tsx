import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchComunicados, criarComunicado, fetchTurmasAdmin, createTurmaAdmin, fetchUsuariosByPapel, createVinculoProfTurma, createUsuarioAdmin, fetchAlunosAdmin, createAlunoAdmin } from '../services/api';
import { Comunicado } from '../components/ComunicadoCard';
import { useAuth } from '../contexts/AuthContext';
import './PainelGestao.css';

export function PainelGestao() {
  const { role } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'comunicados' | 'admin'>('comunicados');
  const [adminSubTab, setAdminSubTab] = useState<'usuarios' | 'turmas' | 'alunos'>('turmas');

  // COMUNICADOS STATE
  const [isCreatingComunicado, setIsCreatingComunicado] = useState(false);
  const [comunicadoForm, setComunicadoForm] = useState({
    titulo: '', corpo_texto: '', nivel_urgencia: 'baixa', id_turma_destino: '00000000-0000-0000-0000-000000000000'
  });

  // ADMIN STATE
  const [isCreatingTurma, setIsCreatingTurma] = useState(false);
  const [turmaForm, setTurmaForm] = useState({ nome: '', turno: 'manha', ano_letivo: new Date().getFullYear() });
  const [isCreatingVinculo, setIsCreatingVinculo] = useState(false);
  const [vinculoForm, setVinculoForm] = useState({ professor_id: '', turma_id: '' });
  const [isCreatingUsuario, setIsCreatingUsuario] = useState(false);
  const [usuarioForm, setUsuarioForm] = useState({ nome: '', email: '', senha: '', papel: 'professor' });
  const [isCreatingAluno, setIsCreatingAluno] = useState(false);
  const [alunoForm, setAlunoForm] = useState({ nome: '', matricula: '', data_nascimento: '', turma_id: '' });

  // QUERIES
  const { data: comunicados, isLoading: loadingCom } = useQuery({
    queryKey: ['comunicados-admin'],
    queryFn: () => fetchComunicados(1),
  });

  const { data: turmas, isLoading: loadingTurmas } = useQuery({
    queryKey: ['admin-turmas'],
    queryFn: fetchTurmasAdmin,
    enabled: role === 'coordenacao' && activeTab === 'admin',
  });

  const { data: professores } = useQuery({
    queryKey: ['admin-professores'],
    queryFn: () => fetchUsuariosByPapel('professor'),
    enabled: role === 'coordenacao' && activeTab === 'admin',
  });

  const { data: usuariosAll, isLoading: loadingUsuarios } = useQuery({
    queryKey: ['admin-usuarios-all'],
    queryFn: () => fetchUsuariosByPapel(),
    enabled: role === 'coordenacao' && activeTab === 'admin' && adminSubTab === 'usuarios',
  });

  const { data: alunos, isLoading: loadingAlunos } = useQuery({
    queryKey: ['admin-alunos'],
    queryFn: fetchAlunosAdmin,
    enabled: role === 'coordenacao' && activeTab === 'admin' && adminSubTab === 'alunos',
  });

  // MUTATIONS
  const createComMutation = useMutation({
    mutationFn: criarComunicado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunicados-admin'] });
      setIsCreatingComunicado(false);
      setComunicadoForm({ titulo: '', corpo_texto: '', nivel_urgencia: 'baixa', id_turma_destino: '00000000-0000-0000-0000-000000000000' });
    },
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

  const createUsuarioMutation = useMutation({
    mutationFn: createUsuarioAdmin,
    onSuccess: () => {
      alert("Usuário criado com sucesso!");
      setIsCreatingUsuario(false);
      setUsuarioForm({ nome: '', email: '', senha: '', papel: 'professor' });
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios-all'] });
      queryClient.invalidateQueries({ queryKey: ['admin-professores'] });
    },
    onError: (err: any) => {
      alert("Erro ao criar usuário: " + err.message);
    }
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

  return (
    <div className="painel-container">
      <header className="painel-header">
        <h2>Painel de Gestão</h2>
        {role === 'coordenacao' && (
          <div className="tabs-container">
            <button 
              className={`tab-btn ${activeTab === 'comunicados' ? 'active' : ''}`}
              onClick={() => setActiveTab('comunicados')}
            >
              Comunicados
            </button>
            <button 
              className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Administração Escolar
            </button>
          </div>
        )}
      </header>

      {activeTab === 'comunicados' && (
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
                  <label>Título</label>
                  <input type="text" required value={comunicadoForm.titulo} onChange={e => setComunicadoForm({...comunicadoForm, titulo: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Urgência</label>
                  <select value={comunicadoForm.nivel_urgencia} onChange={e => setComunicadoForm({...comunicadoForm, nivel_urgencia: e.target.value})}>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mensagem</label>
                  <textarea rows={5} required value={comunicadoForm.corpo_texto} onChange={e => setComunicadoForm({...comunicadoForm, corpo_texto: e.target.value})} />
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
      )}

      {activeTab === 'admin' && role === 'coordenacao' && (
        <div className="tab-content">
          <div className="admin-subtabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
            <button className={`tab-btn ${adminSubTab === 'usuarios' ? 'active' : ''}`} onClick={() => setAdminSubTab('usuarios')} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', borderBottom: adminSubTab === 'usuarios' ? '2px solid #2563eb' : 'none', cursor: 'pointer', fontWeight: adminSubTab === 'usuarios' ? '600' : 'normal', color: adminSubTab === 'usuarios' ? '#2563eb' : '#64748b' }}>Usuários</button>
            <button className={`tab-btn ${adminSubTab === 'turmas' ? 'active' : ''}`} onClick={() => setAdminSubTab('turmas')} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', borderBottom: adminSubTab === 'turmas' ? '2px solid #2563eb' : 'none', cursor: 'pointer', fontWeight: adminSubTab === 'turmas' ? '600' : 'normal', color: adminSubTab === 'turmas' ? '#2563eb' : '#64748b' }}>Turmas</button>
            <button className={`tab-btn ${adminSubTab === 'alunos' ? 'active' : ''}`} onClick={() => setAdminSubTab('alunos')} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', borderBottom: adminSubTab === 'alunos' ? '2px solid #2563eb' : 'none', cursor: 'pointer', fontWeight: adminSubTab === 'alunos' ? '600' : 'normal', color: adminSubTab === 'alunos' ? '#2563eb' : '#64748b' }}>Alunos</button>
          </div>

          {adminSubTab === 'usuarios' && (
            <div className="subtab-content">
              <div className="content-header">
                <h3>Gestão de Usuários</h3>
                <div className="header-actions">
                  <button className="btn-primary" onClick={() => setIsCreatingUsuario(true)}>
                    + Cadastrar Usuário
                  </button>
                </div>
              </div>

              {isCreatingUsuario && (
                <div className="form-card" style={{ maxWidth: '600px' }}>
                  <h3>Cadastrar Novo Usuário</h3>
                  <form onSubmit={e => { e.preventDefault(); createUsuarioMutation.mutate(usuarioForm); }} className="comunicado-form">
                    <div className="form-group">
                      <label>Nome</label>
                      <input type="text" required value={usuarioForm.nome} onChange={e => setUsuarioForm({...usuarioForm, nome: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" required value={usuarioForm.email} onChange={e => setUsuarioForm({...usuarioForm, email: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Senha</label>
                      <input type="password" required value={usuarioForm.senha} onChange={e => setUsuarioForm({...usuarioForm, senha: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Papel</label>
                      <select value={usuarioForm.papel} onChange={e => setUsuarioForm({...usuarioForm, papel: e.target.value})}>
                        <option value="professor">Professor</option>
                        <option value="coordenacao">Coordenação</option>
                        <option value="responsavel">Responsável</option>
                      </select>
                    </div>
                    <div className="form-actions">
                      <button type="button" className="btn-secondary" onClick={() => setIsCreatingUsuario(false)}>Cancelar</button>
                      <button type="submit" className="btn-primary" disabled={createUsuarioMutation.isPending}>
                        {createUsuarioMutation.isPending ? 'Cadastrando...' : 'Cadastrar Usuário'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="admin-list">
                {loadingUsuarios ? <p>Carregando...</p> : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Papel</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosAll?.map((u: any) => (
                        <tr key={u.id}>
                          <td>{u.nome}</td>
                          <td>{u.email}</td>
                          <td style={{ textTransform: 'capitalize' }}>{u.papel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {adminSubTab === 'turmas' && (
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
                      <label>Nome da Turma</label>
                      <input type="text" required placeholder="Ex: Pré-escola 1" value={turmaForm.nome} onChange={e => setTurmaForm({...turmaForm, nome: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Turno</label>
                      <select value={turmaForm.turno} onChange={e => setTurmaForm({...turmaForm, turno: e.target.value})}>
                        <option value="manha">Manhã</option>
                        <option value="tarde">Tarde</option>
                        <option value="integral">Integral</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Ano Letivo</label>
                      <input type="number" required value={turmaForm.ano_letivo} onChange={e => setTurmaForm({...turmaForm, ano_letivo: parseInt(e.target.value)})} />
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
                      <label>Professor</label>
                      <select required value={vinculoForm.professor_id} onChange={e => setVinculoForm({...vinculoForm, professor_id: e.target.value})}>
                        <option value="">Selecione...</option>
                        {professores?.map((p: any) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Turma</label>
                      <select required value={vinculoForm.turma_id} onChange={e => setVinculoForm({...vinculoForm, turma_id: e.target.value})}>
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
          )}

          {adminSubTab === 'alunos' && (
            <div className="subtab-content">
              <div className="content-header">
                <h3>Gestão de Alunos</h3>
                <div className="header-actions">
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
                      <label>Nome Completo</label>
                      <input type="text" required value={alunoForm.nome} onChange={e => setAlunoForm({...alunoForm, nome: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Matrícula</label>
                      <input type="text" required value={alunoForm.matricula} onChange={e => setAlunoForm({...alunoForm, matricula: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Data de Nascimento</label>
                      <input type="date" required value={alunoForm.data_nascimento} onChange={e => setAlunoForm({...alunoForm, data_nascimento: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Turma</label>
                      <select value={alunoForm.turma_id} onChange={e => setAlunoForm({...alunoForm, turma_id: e.target.value})}>
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
                      </tr>
                    </thead>
                    <tbody>
                      {alunos?.map((a: any) => (
                        <tr key={a.id}>
                          <td>{a.nome}</td>
                          <td>{a.matricula}</td>
                          <td>{a.turmas?.nome || 'Sem Turma'}</td>
                          <td>{new Date(a.data_nascimento).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {alunos?.length === 0 && !loadingAlunos && (
                  <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b' }}>Nenhum aluno cadastrado.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
