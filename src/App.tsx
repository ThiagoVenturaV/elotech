import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Mentorship } from './pages/Mentorship';
import { Community } from './pages/Community';
import { Admin } from './pages/Admin';
import { Lock, Mail, Key, ShieldAlert } from 'lucide-react';

interface UserState {
  name: string;
  email: string;
  role: 'candidate' | 'admin';
}

function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [user, setUser] = useState<UserState | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Inicializar estrutura do banco de dados ao carregar a página
  useEffect(() => {
    fetch('/api/setup-db')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log('Banco de dados inicializado.');
        }
      })
      .catch(err => {
        console.error('Falha de conexão com a API de setup do banco:', err);
      });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const emailClean = loginEmail.trim().toLowerCase();
    const passClean = loginPassword.trim();

    if (emailClean === 'candidata@elotech.com' && passClean === 'senha123') {
      setUser({
        name: 'Dandara Silva',
        email: 'candidata@elotech.com',
        role: 'candidate'
      });
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
    } else if (emailClean === 'parceiro@elotech.com' && passClean === 'senha123') {
      setUser({
        name: 'Nubank Recrutamento',
        email: 'parceiro@elotech.com',
        role: 'admin'
      });
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
      // Redirecionar para painel admin automaticamente
      setCurrentTab('admin');
    } else {
      setLoginError('Credenciais inválidas para demonstração. Use os dados exibidos abaixo.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentTab('home');
  };

  // Interceptador de navegação para controle de acesso (Nielsen: Prevenção de erros)
  const handleTabChange = (tab: string) => {
    if (tab === 'admin') {
      if (!user) {
        setLoginError('Acesse como Empresa Parceira para visualizar o painel de contratações.');
        setShowLoginModal(true);
        return;
      }
      if (user.role !== 'admin') {
        setCurrentTab('admin-restricted');
        return;
      }
    }
    setCurrentTab(tab);
  };

  const renderPage = () => {
    switch (currentTab) {
      case 'home':
        return <Home onNavigate={handleTabChange} />;
      case 'bootcamps':
        return <Catalog currentUser={user} onTriggerLogin={() => {
          setLoginError('Faça login como Candidata para se inscrever nos bootcamps.');
          setShowLoginModal(true);
        }} />;
      case 'mentoria':
        return <Mentorship />;
      case 'comunidade':
        return <Community />;
      case 'admin':
        return <Admin />;
      case 'admin-restricted':
        return (
          <div className="nb-card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px', borderLeft: '8px solid var(--color-orange)' }}>
            <ShieldAlert size={48} className="text-orange" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Acesso Restrito</h3>
            <p style={{ color: 'var(--color-gray-dark)', marginBottom: '24px' }}>
              Este painel de empregabilidade é exclusivo para empresas parceiras gerenciarem candidaturas e realizarem contratações.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setCurrentTab('home')}>
                Ir para o Início
              </button>
              <button className="btn btn-primary" onClick={() => { handleLogout(); setShowLoginModal(true); setLoginError('Acesse com o login de parceiro.'); }}>
                Conectar como Admin
              </button>
            </div>
          </div>
        );
      default:
        return <Home onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="app-container">
      <Header 
        currentTab={currentTab} 
        onTabChange={handleTabChange} 
        currentUser={user}
        onLogout={handleLogout}
        onLoginClick={() => { setLoginError(''); setShowLoginModal(true); }}
      />
      
      <main className="main-content">
        {renderPage()}
      </main>
      
      <Footer />

      {/* Login Modal com credenciais de demonstração (Heurísticas de Nielsen 3 & 10) */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <button className="modal-close" onClick={() => setShowLoginModal(false)}>X</button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Lock size={24} className="text-magenta" />
              <h3 style={{ fontSize: '22px' }}>Acesse a EloTech</h3>
            </div>

            {loginError && (
              <div style={{ backgroundColor: 'var(--color-orange-light)', border: '2px solid var(--color-orange)', padding: '12px', fontSize: '13px', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '16px' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>E-mail</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray)' }} />
                  <input 
                    type="email" 
                    required 
                    className="nb-input" 
                    style={{ paddingLeft: '40px' }} 
                    placeholder="seu.email@exemplo.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Senha</label>
                <div style={{ position: 'relative' }}>
                  <Key size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray)' }} />
                  <input 
                    type="password" 
                    required 
                    className="nb-input" 
                    style={{ paddingLeft: '40px' }} 
                    placeholder="Sua senha"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-magenta" style={{ width: '100%', marginTop: '8px' }}>
                Entrar na Plataforma
              </button>
            </form>

            {/* Caixa de Demonstração (Heurística 10: Ajuda e documentação) */}
            <div style={{ marginTop: '24px', backgroundColor: 'var(--color-blue-light)', border: '2px dashed var(--color-blue)', padding: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-blue-dark)', marginBottom: '8px' }}>
                Credenciais de Demonstração:
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ borderBottom: '1px solid rgba(0, 86, 145, 0.2)', paddingBottom: '6px' }}>
                  <strong>Acesso Aluna (Candidata Trans):</strong>
                  <br />E-mail: <code style={{ background: '#FFFFFF', padding: '2px 4px', border: '1px solid #005691' }}>candidata@elotech.com</code>
                  <br />Senha: <code style={{ background: '#FFFFFF', padding: '2px 4px', border: '1px solid #005691' }}>senha123</code>
                </li>
                <li>
                  <strong>Acesso Empresa (Admin/Recrutador):</strong>
                  <br />E-mail: <code style={{ background: '#FFFFFF', padding: '2px 4px', border: '1px solid #005691' }}>parceiro@elotech.com</code>
                  <br />Senha: <code style={{ background: '#FFFFFF', padding: '2px 4px', border: '1px solid #005691' }}>senha123</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
