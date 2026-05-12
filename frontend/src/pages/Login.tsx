import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen, LogIn } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export function Login() {
  const { user, role, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Se já estiver logado, redireciona
  if (!isLoading && user) {
    if (role === 'responsavel') return <Navigate to="/mural" replace />;
    if (role === 'professor' || role === 'coordenacao') return <Navigate to="/painel-gestao" replace />;
    // Fallback se não tiver role definida ou errada
    return <Navigate to="/mural" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Por favor, preencha seu e-mail para recuperar a senha.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError(error.message);
    } else {
      setError('Verifique seu e-mail para o link de recuperação. (Nota: Funcional apenas com SMTP configurado no Supabase)');
    }
    setLoading(false);
  };

  if (isLoading) return <div className="page-loading">Verificando sessão...</div>;

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <BookOpen className="logo-icon-login" size={48} />
          <h2>Caderneta Escola & Família</h2>
          <p>Acesse sua conta para continuar</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>E-mail</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          
          <div className="form-group">
            <label>Senha</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-login">
            {loading ? 'Entrando...' : <><LogIn size={18} /> Entrar</>}
          </button>
        </form>

        <div className="login-footer">
          <button type="button" className="btn-link" onClick={handleResetPassword} disabled={loading}>
            Esqueci minha senha
          </button>
        </div>
      </div>
    </div>
  );
}
