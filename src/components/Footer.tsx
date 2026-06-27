import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/Icone.svg" alt="EloTech Logo" style={{ height: '36px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
            <span>EloTech</span>
          </div>
          <p className="footer-subtext">
            © 2026 EloTech Hub. Soberania Tecnológica Trans e Nordestina. Feito com orgulho e resistência no Nordeste.
          </p>
        </div>
        <div className="footer-links">
          <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Sobre Nós</a>
          <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Privacidade</a>
          <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Termos</a>
          <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Contato</a>
          <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Manifesto Cordel</a>
        </div>
      </div>
    </footer>
  );
};
