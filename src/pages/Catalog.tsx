import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Filter, CheckSquare, Square, Terminal, Cpu, Database, Eye } from 'lucide-react';

interface Bootcamp {
  id: string;
  company_id: string;
  company_name: string;
  company_logo: string;
  title: string;
  description: string;
  duration: string;
  location: string;
  status: string;
  tags: string[];
  hiring_positions: number;
}

export const Catalog: React.FC = () => {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [filteredBootcamps, setFilteredBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  
  // Inscrição / Modal
  const [selectedBootcamp, setSelectedBootcamp] = useState<Bootcamp | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/bootcamps')
      .then(res => res.json())
      .then(data => {
        setBootcamps(data);
        setFilteredBootcamps(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar bootcamps:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedTracks.length === 0) {
      setFilteredBootcamps(bootcamps);
    } else {
      // Filtrar se pelo menos uma tag do bootcamp bater com alguma das trilhas selecionadas
      const filtered = bootcamps.filter(b => {
        return b.tags.some(tag => {
          const tagLower = tag.toLowerCase();
          return selectedTracks.some(track => {
            const trackLower = track.toLowerCase();
            // Mapeamentos de trilha
            if (trackLower === 'frontend') return tagLower.includes('react') || tagLower.includes('html') || tagLower.includes('javascript') || tagLower.includes('vue');
            if (trackLower === 'backend') return tagLower.includes('node') || tagLower.includes('postgresql') || tagLower.includes('docker') || tagLower.includes('sql');
            if (trackLower === 'data science') return tagLower.includes('python') || tagLower.includes('pandas') || tagLower.includes('sql');
            if (trackLower === 'design & ux') return tagLower.includes('figma') || tagLower.includes('a11y') || tagLower.includes('acessibilidade');
            return false;
          });
        });
      });
      setFilteredBootcamps(filtered);
    }
  }, [selectedTracks, bootcamps]);

  const toggleTrack = (track: string) => {
    setSelectedTracks(prev => 
      prev.includes(track) ? prev.filter(t => t !== track) : [...prev, track]
    );
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBootcamp) return;

    setIsSubmitting(true);
    fetch('/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_name: userName,
        email: email,
        bootcamp_id: selectedBootcamp.id
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Falha na inscrição');
        return res.json();
      })
      .then(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setUserName('');
        setEmail('');
        setGithubUrl('');
      })
      .catch(err => {
        console.error('Erro na inscrição:', err);
        setIsSubmitting(false);
        alert('Erro ao realizar inscrição. Tente novamente.');
      });
  };

  // Retorna o ícone correto com base no título do bootcamp
  const getBootcampIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('fullstack') || titleLower.includes('frontend')) {
      return <Terminal size={24} className="text-magenta" />;
    }
    if (titleLower.includes('backend') || titleLower.includes('node')) {
      return <Database size={24} className="text-blue" />;
    }
    return <Cpu size={24} className="text-orange" />;
  };

  return (
    <div className="catalog-page">
      {/* Intro banner */}
      <section className="nb-card mb-32" style={{ borderLeft: '8px solid var(--color-magenta)' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Bootcamps Transformadores</h2>
        <p style={{ color: 'var(--color-gray-dark)', fontSize: '16px' }}>
          Forjando soberania tecnológica com a força da nossa comunidade. Nossos programas intensivos são desenhados para a comunidade trans e dissidente de gênero, unindo inovação técnica com impacto social real e vagas garantidas de contratação.
        </p>
      </section>

      {/* Main Grid: Sidebar + List */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Sidebar Filters */}
        <aside className="nb-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid var(--color-dark)', paddingBottom: '12px', marginBottom: '16px' }}>
            <Filter size={18} />
            <span>Trilhas</span>
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Frontend', 'Backend', 'Data Science', 'Design & UX'].map(track => {
              const isChecked = selectedTracks.includes(track);
              return (
                <div 
                  key={track} 
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                  onClick={() => toggleTrack(track)}
                >
                  {isChecked ? (
                    <CheckSquare size={20} className="text-magenta" />
                  ) : (
                    <Square size={20} />
                  )}
                  <span style={{ fontSize: '15px', fontWeight: 600 }}>{track}</span>
                </div>
              );
            })}
          </div>

          {selectedTracks.length > 0 && (
            <button 
              className="btn btn-secondary" 
              style={{ marginTop: '20px', width: '100%', padding: '8px 12px', fontSize: '12px' }}
              onClick={() => setSelectedTracks([])}
            >
              Limpar Filtros
            </button>
          )}
        </aside>

        {/* Bootcamps list */}
        <main>
          {loading ? (
            <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="nb-card" style={{ height: '240px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  Carregando oportunidades...
                </div>
              ))}
            </div>
          ) : filteredBootcamps.length === 0 ? (
            <div className="nb-card" style={{ textAlign: 'center', padding: '48px' }}>
              <p style={{ fontWeight: 600, color: 'var(--color-gray-dark)' }}>Nenhum bootcamp encontrado para as trilhas selecionadas.</p>
            </div>
          ) : (
            <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {filteredBootcamps.map(b => (
                <div 
                  key={b.id} 
                  className="nb-card nb-card-hover" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    minHeight: '300px'
                  }}
                >
                  <div>
                    <div className="flex-between mb-16">
                      <span className={`nb-badge ${b.status === 'aberto' ? 'badge-magenta' : b.status === 'andamento' ? 'badge-blue' : 'badge-orange'}`}>
                        {b.status === 'aberto' ? 'Inscrições Abertas' : b.status === 'andamento' ? 'Em Andamento' : 'Em Breve'}
                      </span>
                      {getBootcampIcon(b.title)}
                    </div>

                    <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{b.title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--color-gray-dark)', marginBottom: '16px', minHeight: '40px' }}>
                      {b.description}
                    </p>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {b.tags.map(t => (
                        <span key={t} className="nb-badge" style={{ fontSize: '10px', padding: '2px 6px' }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ borderTop: '2px solid var(--color-gray-light)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <Clock size={12} />
                        {b.duration}
                      </span>
                      <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <MapPin size={12} />
                        {b.location}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                        onClick={() => {
                          setSelectedBootcamp(b);
                          setShowApplyModal(true);
                          setSubmitSuccess(false);
                        }}
                      >
                        <Eye size={14} />
                        <span>Detalhes</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Details & Apply Modal */}
      {showApplyModal && selectedBootcamp && (
        <div className="modal-overlay" onClick={() => { if (!isSubmitting) setShowApplyModal(false); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <button className="modal-close" onClick={() => setShowApplyModal(false)} disabled={isSubmitting}>X</button>
            
            {submitSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <h3 style={{ fontSize: '28px', color: 'var(--color-magenta)', marginBottom: '12px' }}>Inscrição Concluída!</h3>
                <p style={{ color: 'var(--color-gray-dark)', marginBottom: '24px', fontSize: '16px' }}>
                  Sua inscrição no bootcamp <strong>{selectedBootcamp.title}</strong> foi realizada. 
                  O status e a evolução da sua candidatura podem ser acompanhados na aba <strong>Contratações</strong>.
                </p>
                <button className="btn btn-primary" onClick={() => setShowApplyModal(false)}>
                  Voltar ao Catálogo
                </button>
              </div>
            ) : (
              <div>
                <span className={`nb-badge ${selectedBootcamp.status === 'aberto' ? 'badge-magenta' : selectedBootcamp.status === 'andamento' ? 'badge-blue' : 'badge-orange'}`} style={{ marginBottom: '12px' }}>
                  {selectedBootcamp.status === 'aberto' ? 'Inscrições Abertas' : selectedBootcamp.status === 'andamento' ? 'Em Andamento' : 'Em Breve'}
                </span>
                
                <h3 style={{ fontSize: '26px', marginBottom: '8px' }}>{selectedBootcamp.title}</h3>
                <p style={{ fontSize: '15px', color: 'var(--color-gray-dark)', marginBottom: '16px' }}>
                  {selectedBootcamp.description}
                </p>

                <div style={{ backgroundColor: 'var(--color-blue-light)', border: '2px dashed var(--color-blue)', padding: '12px', marginBottom: '20px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-blue-dark)' }}>
                    Oportunidade de Contratação:
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--color-dark)' }}>
                    Ao concluir este bootcamp com aproveitamento, você concorre diretamente a uma das <strong>{selectedBootcamp.hiring_positions} vagas garantidas</strong> de contratação imediata pelo parceiro.
                  </p>
                </div>

                {selectedBootcamp.status === 'aberto' ? (
                  <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '18px', borderBottom: '2px solid var(--color-dark)', paddingBottom: '8px' }}>Formulário de Inscrição</h4>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Nome Completo / Social</label>
                      <input 
                        type="text" 
                        required 
                        className="nb-input" 
                        placeholder="Seu nome"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>E-mail para Contato</label>
                      <input 
                        type="email" 
                        required 
                        className="nb-input" 
                        placeholder="seu.email@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>GitHub ou Link do Portfólio (Opcional)</label>
                      <input 
                        type="url" 
                        className="nb-input" 
                        placeholder="https://github.com/usuario"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-magenta" 
                      style={{ marginTop: '8px', width: '100%' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processando inscrição...' : 'Confirmar Inscrição no Bootcamp'}
                    </button>
                  </form>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px', border: '2px solid var(--color-dark)', backgroundColor: 'var(--color-gray-light)' }}>
                    <p style={{ fontWeight: 600 }}>Inscrições indisponíveis no momento para este bootcamp.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
