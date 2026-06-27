import React, { useState } from 'react';
import { LogOut, Menu, X, LogIn } from 'lucide-react';

interface UserState {
  name: string;
  email: string;
  role: 'candidate' | 'admin';
}

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentUser: UserState | null;
  onLogout: () => void;
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentTab, 
  onTabChange, 
  currentUser, 
  onLogout, 
  onLoginClick 
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = (tab: string) => {
    onTabChange(tab);
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-top-accent"></div>
      <div className="header-inner">
        <a 
          href="#" 
          className="logo" 
          onClick={(e) => { e.preventDefault(); handleLinkClick('home'); }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <img src="/Icone.svg" alt="EloTech Logo" style={{ height: '36px', width: 'auto' }} />
          <span>EloTech</span>
        </a>

        {/* Hamburger toggle button for mobile */}
        <button 
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a 
            href="#" 
            className={`nav-link ${currentTab === 'bootcamps' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleLinkClick('bootcamps'); }}
          >
            Bootcamps
          </a>
          <a 
            href="#" 
            className={`nav-link ${currentTab === 'mentoria' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleLinkClick('mentoria'); }}
          >
            Mentoria
          </a>
          <a 
            href="#" 
            className={`nav-link ${currentTab === 'comunidade' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleLinkClick('comunidade'); }}
          >
            Comunidade
          </a>
          
          {/* Restrição de link corporativo visual */}
          <a 
            href="#" 
            className={`nav-link ${currentTab === 'admin' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleLinkClick('admin'); }}
          >
            Contratações
          </a>

          {/* User info & action drawer inside mobile menu */}
          <div className="mobile-action-container">
            {currentUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '8px', border: '1.5px solid var(--color-dark)', backgroundColor: 'var(--color-gray-light)', fontSize: '13px' }}>
                  <div style={{ fontWeight: 700 }}>{currentUser.name}</div>
                  <span className={`nb-badge ${currentUser.role === 'admin' ? 'badge-blue' : 'badge-magenta'}`} style={{ fontSize: '9px', padding: '2px 4px', marginTop: '4px' }}>
                    {currentUser.role === 'admin' ? 'Parceira' : 'Aluna'}
                  </span>
                </div>
                <button 
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => { onLogout(); setMenuOpen(false); }}
                >
                  <LogOut size={16} />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-magenta"
                style={{ width: '100%' }}
                onClick={() => { onLoginClick(); setMenuOpen(false); }}
              >
                <LogIn size={16} />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </nav>
        
        {/* User profile details & action buttons - Desktop view */}
        <div className="desktop-action-container">
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{currentUser.name}</div>
                <span className={`nb-badge ${currentUser.role === 'admin' ? 'badge-blue' : 'badge-magenta'}`} style={{ fontSize: '9px', padding: '1px 4px' }}>
                  {currentUser.role === 'admin' ? 'Parceira' : 'Aluna'}
                </span>
              </div>
              <button 
                className="btn btn-secondary"
                style={{ padding: '10px' }}
                onClick={onLogout}
                aria-label="Sair da conta"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-magenta"
              onClick={onLoginClick}
            >
              <LogIn size={16} />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        .mobile-action-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }
        .desktop-action-container {
          display: none;
        }
        
        @media (min-width: 768px) {
          .mobile-action-container {
            display: none;
          }
          .desktop-action-container {
            display: flex;
            align-items: center;
            gap: 16px;
          }
        }
      `}</style>
    </header>
  );
};
