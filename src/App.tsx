import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Mentorship } from './pages/Mentorship';
import { Community } from './pages/Community';
import { Admin } from './pages/Admin';

function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Inicializar estrutura do banco de dados ao carregar a página
  useEffect(() => {
    fetch('/api/setup-db')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log('Banco de dados inicializado localmente (se necessário).');
        } else {
          console.error('Falha ao inicializar banco de dados:', data.error);
        }
      })
      .catch(err => {
        console.error('Falha de conexão com a API de setup do banco:', err);
      });
  }, []);

  const renderPage = () => {
    switch (currentTab) {
      case 'home':
        return <Home onNavigate={setCurrentTab} />;
      case 'bootcamps':
        return <Catalog />;
      case 'mentoria':
        return <Mentorship />;
      case 'comunidade':
        return <Community />;
      case 'admin':
        return <Admin />;
      default:
        return <Home onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="app-container">
      <Header currentTab={currentTab} onTabChange={setCurrentTab} />
      
      <main className="main-content">
        {renderPage()}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
