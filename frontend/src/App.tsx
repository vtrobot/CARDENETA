import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { BookOpen, UserCircle, Bell } from 'lucide-react';
import { Mural } from './pages/Mural';
import { PainelGestao } from './pages/PainelGestao';
import './index.css';

function AppLayout({ children }: { children: React.ReactNode }) {
  // Simulação de login
  const mockRole = localStorage.getItem('mockUserRole') || 'responsavel';
  
  return (
    <div className="app-container" data-testid="app-container">
      <header className="app-header">
        <div className="logo-container">
          <BookOpen className="logo-icon" size={28} />
          <h1>Caderneta Escola & Família</h1>
        </div>
        <nav className="main-nav">
          {mockRole === 'responsavel' && <Link to="/mural">Mural</Link>}
          {(mockRole === 'professor' || mockRole === 'coordenacao') && <Link to="/painel-gestao">Painel Gestão</Link>}
          
          <div className="user-profile">
            <span className="role-badge">{mockRole}</span>
            <UserCircle size={24} />
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
  const mockRole = localStorage.getItem('mockUserRole') || 'responsavel';
  return <Navigate to={mockRole === 'responsavel' ? '/mural' : '/painel-gestao'} replace />;
}

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/mural" element={<Mural />} />
          <Route path="/painel-gestao" element={<PainelGestao />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
