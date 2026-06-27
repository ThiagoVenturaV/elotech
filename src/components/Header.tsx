import React from 'react';
import { LogIn, User } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
  return (
    <header className="header">
      <div className="header-top-accent"></div>
      <div className="header-inner">
        <a 
          href="#" 
          className="logo" 
          onClick={(e) => { e.preventDefault(); onTabChange('home'); }}
        >
          EloTech
        </a>
        
        <nav className="nav-links">
          <a 
            href="#" 
            className={`nav-link ${currentTab === 'bootcamps' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onTabChange('bootcamps'); }}
          >
            Bootcamps
          </a>
          <a 
            href="#" 
            className={`nav-link ${currentTab === 'mentoria' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onTabChange('mentoria'); }}
          >
            Mentoria
          </a>
          <a 
            href="#" 
            className={`nav-link ${currentTab === 'comunidade' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onTabChange('comunidade'); }}
          >
            Comunidade
          </a>
          <a 
            href="#" 
            className={`nav-link ${currentTab === 'admin' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onTabChange('admin'); }}
          >
            Contratações
          </a>
        </nav>
        
        <div>
          {currentTab === 'admin' ? (
            <button 
              className="btn btn-primary"
              onClick={() => onTabChange('home')}
            >
              <User size={16} />
              <span>Sair Admin</span>
            </button>
          ) : (
            <button 
              className="btn btn-magenta"
              onClick={() => onTabChange('admin')}
            >
              <LogIn size={16} />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
