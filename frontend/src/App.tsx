import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { BookOpen, MessageSquare, LogOut } from 'lucide-react';
import { Mural } from './pages/Mural';
import { PainelGestao } from './pages/PainelGestao';
import { Mensagens } from './pages/Mensagens';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { supabase } from './lib/supabase';
import './index.css';

import { useQuery } from '@tanstack/react-query';
import { fetchConversas } from './services/api';

function AppLayout({ children }: { children: React.ReactNode }) {
  const { role, user } = useAuth();
  const navigate = useNavigate();

  const { data: conversas } = useQuery({
    queryKey: ['conversas'],
    queryFn: fetchConversas,
    enabled: !!user,
    refetchInterval: 10000, // Pooling p/ o badge
  });

  const unreadCount = conversas?.reduce((acc: number, c: any) => acc + (c.nao_lidas || 0), 0) || 0;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
  
  return (
    <div className="app-container" data-testid="app-container">
      <header className="app-header">
        <div className="logo-container">
          <BookOpen className="logo-icon" size={28} />
          <h1>Caderneta Escola & Família</h1>
        </div>
        <nav className="main-nav">
          {role === 'responsavel' && <Link to="/mural">Mural</Link>}
          <Link to="/mensagens" className="nav-icon-link" title="Mensagens" style={{ position: 'relative' }}>
            <MessageSquare size={20} /> 
            <span>Mensagens</span>
            {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
          </Link>
          {(role === 'professor' || role === 'coordenacao') && <Link to="/painel-gestao">Painel Gestão</Link>}
          
          <div className="user-profile">
            <span className="role-badge">{role || '...'}</span>
            <button onClick={handleLogout} className="btn-logout" title="Sair">
              <LogOut size={20} />
            </button>
          </div>
        </nav>
      </header>
      <main className="app-main-content">
        {children}
      </main>
    </div>
  );
}

function Welcome() {
  const { role, user, isLoading } = useAuth();
  
  if (isLoading) return <div className="page-loading">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={role === 'responsavel' ? '/mural' : '/painel-gestao'} replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Welcome />} />
          <Route path="/mural" element={
            <ProtectedRoute allowedRoles={['responsavel']}>
              <AppLayout><Mural /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/mensagens" element={
            <ProtectedRoute>
              <AppLayout><Mensagens /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/painel-gestao" element={
            <ProtectedRoute allowedRoles={['professor', 'coordenacao']}>
              <AppLayout><PainelGestao /></AppLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
