import React from 'react';
import { BookOpen } from 'lucide-react';

function App() {
  return (
    <div className="app-container" data-testid="app-container">
      <header className="app-header">
        <div className="logo-container">
          <BookOpen className="logo-icon" size={32} />
          <h1>Caderneta Escola & Família</h1>
        </div>
      </header>
      <main className="app-main">
        <section className="welcome-card" data-testid="welcome-card">
          <h2>Bem-vindo(a)</h2>
          <p>O canal oficial de comunicação entre escola e família.</p>
          <div className="features">
            <div className="feature-item">
              <span className="feature-icon">📢</span>
              <p>Comunicados Oficiais</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <p>Confirmação de Leitura</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <p>Acesso Fácil</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
