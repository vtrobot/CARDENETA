import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTurmasAdmin } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './PainelGestao.css';

// Novas abas refatoradas
import { ComunicadosTab } from './PainelGestaoTabs/ComunicadosTab';
import { UsuariosTab } from './PainelGestaoTabs/UsuariosTab';
import { TurmasTab } from './PainelGestaoTabs/TurmasTab';
import { AlunosTab } from './PainelGestaoTabs/AlunosTab';

export function PainelGestao() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<'comunicados' | 'admin'>('comunicados');
  const [adminSubTab, setAdminSubTab] = useState<'usuarios' | 'turmas' | 'alunos'>('turmas');

  // Query global de turmas necessária para ComunicadosTab e AlunosTab
  const { data: turmas } = useQuery({
    queryKey: ['admin-turmas'],
    queryFn: fetchTurmasAdmin,
    enabled: role === 'coordenacao' || role === 'professor',
  });

  return (
    <div className="painel-container">
      <header className="painel-header">
        <h2>Painel de Gestão</h2>
        {(role === 'coordenacao' || role === 'professor') && (
          <div className="tabs-container">
            <button 
              className={`tab-btn ${activeTab === 'comunicados' ? 'active' : ''}`}
              onClick={() => setActiveTab('comunicados')}
              aria-label="Aba de Comunicados"
            >
              Comunicados
            </button>
            <button 
              className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
              aria-label="Aba de Administração Escolar"
            >
              Administração Escolar
            </button>
          </div>
        )}
      </header>

      {activeTab === 'comunicados' && (
        <ComunicadosTab turmas={turmas} />
      )}

      {activeTab === 'admin' && (role === 'coordenacao' || role === 'professor') && (
        <div className="tab-content">
          {role === 'coordenacao' ? (
            <>
              <div className="admin-subtabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <button 
                  className={`tab-btn ${adminSubTab === 'usuarios' ? 'active' : ''}`} 
                  onClick={() => setAdminSubTab('usuarios')} 
                  style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', borderBottom: adminSubTab === 'usuarios' ? '2px solid #2563eb' : 'none', cursor: 'pointer', fontWeight: adminSubTab === 'usuarios' ? '600' : 'normal', color: adminSubTab === 'usuarios' ? '#2563eb' : '#64748b' }}
                  aria-label="Sub-aba Usuários"
                >
                  Usuários
                </button>
                <button 
                  className={`tab-btn ${adminSubTab === 'turmas' ? 'active' : ''}`} 
                  onClick={() => setAdminSubTab('turmas')} 
                  style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', borderBottom: adminSubTab === 'turmas' ? '2px solid #2563eb' : 'none', cursor: 'pointer', fontWeight: adminSubTab === 'turmas' ? '600' : 'normal', color: adminSubTab === 'turmas' ? '#2563eb' : '#64748b' }}
                  aria-label="Sub-aba Turmas"
                >
                  Turmas
                </button>
                <button 
                  className={`tab-btn ${adminSubTab === 'alunos' ? 'active' : ''}`} 
                  onClick={() => setAdminSubTab('alunos')} 
                  style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', borderBottom: adminSubTab === 'alunos' ? '2px solid #2563eb' : 'none', cursor: 'pointer', fontWeight: adminSubTab === 'alunos' ? '600' : 'normal', color: adminSubTab === 'alunos' ? '#2563eb' : '#64748b' }}
                  aria-label="Sub-aba Alunos"
                >
                  Alunos
                </button>
              </div>

              {adminSubTab === 'usuarios' && <UsuariosTab />}
              {adminSubTab === 'turmas' && <TurmasTab />}
              {adminSubTab === 'alunos' && <AlunosTab turmas={turmas} />}
            </>
          ) : (
            <AlunosTab turmas={turmas} />
          )}
        </div>
      )}
    </div>
  );
}
