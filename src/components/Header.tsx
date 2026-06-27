import React, { useState } from 'react';
import { LogIn, User, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
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
        >
          EloTech
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
          <a 
            href="#" 
            className={`nav-link ${currentTab === 'admin' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleLinkClick('admin'); }}
          >
            Contratações
          </a>
          
          {/* Action button inside nav menu on mobile for easier touch */}
          <div style={{ marginTop: '12px' }} className="mobile-action-container">
            {currentTab === 'admin' ? (
              <button 
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => handleLinkClick('home')}
              >
                <User size={16} />
                <span>Sair Admin</span>
              </button>
            ) : (
              <button 
                className="btn btn-magenta"
                style={{ width: '100%' }}
                onClick={() => handleLinkClick('admin')}
              >
                <LogIn size={16} />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </nav>
        
        {/* Visible only on Desktop */}
        <div style={{ display: 'none' }} className="desktop-action-container">
          {currentTab === 'admin' ? (
            <button 
              className="btn btn-primary"
              onClick={() => handleLinkClick('home')}
            >
              <User size={16} />
              <span>Sair Admin</span>
            </button>
          ) : (
            <button 
              className="btn btn-magenta"
              onClick={() => handleLinkClick('admin')}
            >
              <LogIn size={16} />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        /* Oculta/Exibe os containers de ação baseando-se em breakpoints */
        .mobile-action-container {
          display: block;
        }
        .desktop-action-container {
          display: none;
        }
        
        @media (min-width: 768px) {
          .mobile-action-container {
            display: none;
          }
          .desktop-action-container {
            display: block;
          }
        }
      `}</style>
    </header>
  );
};
