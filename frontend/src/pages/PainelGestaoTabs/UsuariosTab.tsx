import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsuariosByPapel, createUsuarioAdmin } from '../../services/api';

export function UsuariosTab() {
  const queryClient = useQueryClient();
  const [isCreatingUsuario, setIsCreatingUsuario] = useState(false);
  const [usuarioForm, setUsuarioForm] = useState({ nome: '', email: '', senha: '', papel: 'professor' });

  const { data: usuariosAll, isLoading: loadingUsuarios } = useQuery({
    queryKey: ['admin-usuarios-all'],
    queryFn: () => fetchUsuariosByPapel(),
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

  return (
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
              <label htmlFor="user-nome">Nome</label>
              <input 
                id="user-nome"
                type="text" 
                required 
                value={usuarioForm.nome} 
                onChange={e => setUsuarioForm({...usuarioForm, nome: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="user-email">Email</label>
              <input 
                id="user-email"
                type="email" 
                required 
                value={usuarioForm.email} 
                onChange={e => setUsuarioForm({...usuarioForm, email: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="user-senha">Senha</label>
              <input 
                id="user-senha"
                type="password" 
                required 
                value={usuarioForm.senha} 
                onChange={e => setUsuarioForm({...usuarioForm, senha: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="user-papel">Papel</label>
              <select 
                id="user-papel"
                value={usuarioForm.papel} 
                onChange={e => setUsuarioForm({...usuarioForm, papel: e.target.value})}
              >
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
  );
}
