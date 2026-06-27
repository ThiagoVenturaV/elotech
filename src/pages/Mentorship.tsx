import React, { useEffect, useState } from 'react';
import { Search, Calendar, User, Send } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  title: string;
  bio: string;
  tags: string[];
  availability: string;
}

export const Mentorship: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal de solicitação
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/mentors')
      .then(res => res.json())
      .then(data => {
        setMentors(data);
        setFilteredMentors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar mentoras:', err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredMentors(mentors);
      return;
    }

    const queryLower = searchQuery.toLowerCase();
    const filtered = mentors.filter(m => {
      return (
        m.name.toLowerCase().includes(queryLower) ||
        m.title.toLowerCase().includes(queryLower) ||
        m.bio.toLowerCase().includes(queryLower) ||
        m.tags.some(t => t.toLowerCase().includes(queryLower))
      );
    });
    setFilteredMentors(filtered);
  };

  const handleRequestMentorship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;

    setIsSubmitting(true);
    // Simular o envio da solicitação
    setTimeout(() => {
      setIsSubmitting(false);
      setRequestSuccess(true);
      setUserName('');
      setUserEmail('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="mentorship-page">
      {/* Intro Banner */}
      <section className="nb-card mb-32" style={{ borderLeft: '8px solid var(--color-blue)' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Encontre Sua Mentoria. Evolua suas Raízes.</h2>
        <p style={{ color: 'var(--color-gray-dark)', fontSize: '16px' }}>
          Conecte-se com líderes técnicos do Nordeste e do Brasil. Expanda suas habilidades em um ambiente seguro que valoriza sua identidade de gênero e fomenta a soberania tecnológica.
        </p>
      </section>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray)' }} />
          <input 
            type="text" 
            className="nb-input" 
            style={{ paddingLeft: '48px' }} 
            placeholder="Busque por área, nome ou tecnologia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px' }}>
          Buscar
        </button>
      </form>

      {/* Mentors Grid */}
      {loading ? (
        <div className="grid-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="nb-card" style={{ height: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              Carregando mentoras...
            </div>
          ))}
        </div>
      ) : filteredMentors.length === 0 ? (
        <div className="nb-card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ fontWeight: 600 }}>Nenhuma mentora encontrada para os termos buscados.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredMentors.map((m, index) => {
            // Alternar cores de borda para as mentoras como no design
            const borderColors = ['#B33B72', '#005691', '#D97706'];
            const accentColor = borderColors[index % borderColors.length];

            return (
              <div 
                key={m.id} 
                className="nb-card nb-card-hover" 
                style={{ 
                  borderLeft: `6px solid ${accentColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '350px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      borderRadius: '50%', 
                      border: '2px solid var(--color-dark)', 
                      overflow: 'hidden',
                      backgroundColor: 'var(--color-gray-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <User size={30} className="text-gray" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', lineHeight: '1.2' }}>{m.name}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--color-gray)' }}>{m.title}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {m.tags.map(t => (
                      <span key={t} className="nb-badge" style={{ fontSize: '10px', padding: '2px 6px' }}>{t}</span>
                    ))}
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--color-gray-dark)', marginBottom: '16px', lineHeight: '1.6' }}>
                    {m.bio}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--color-gray-dark)', borderTop: '2px solid var(--color-gray-light)', paddingTop: '12px', marginBottom: '16px' }}>
                    <Calendar size={14} className="text-magenta" />
                    <span>Disponível: {m.availability}</span>
                  </div>

                  <button 
                    className="btn btn-secondary" 
                    style={{ width: '100%', fontSize: '13px', padding: '10px' }}
                    onClick={() => {
                      setSelectedMentor(m);
                      setShowRequestModal(true);
                      setRequestSuccess(false);
                    }}
                  >
                    Solicitar Mentoria
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Request Modal */}
      {showRequestModal && selectedMentor && (
        <div className="modal-overlay" onClick={() => { if (!isSubmitting) setShowRequestModal(false); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <button className="modal-close" onClick={() => setShowRequestModal(false)} disabled={isSubmitting}>X</button>
            
            {requestSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <h3 style={{ fontSize: '28px', color: 'var(--color-magenta)', marginBottom: '12px' }}>Solicitação Enviada!</h3>
                <p style={{ color: 'var(--color-gray-dark)', marginBottom: '24px', fontSize: '16px' }}>
                  Sua solicitação de mentoria com <strong>{selectedMentor.name}</strong> foi encaminhada com sucesso. 
                  Você receberá um e-mail de confirmação para agendar o encontro na plataforma externa de chamadas.
                </p>
                <button className="btn btn-primary" onClick={() => setShowRequestModal(false)}>
                  Voltar para Mentorias
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>Solicitar Mentoria</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-gray-dark)', marginBottom: '20px' }}>
                  Preencha as informações para se conectar com <strong>{selectedMentor.name}</strong> ({selectedMentor.title}).
                </p>

                <form onSubmit={handleRequestMentorship} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Seu Nome</label>
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
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Seu E-mail</label>
                    <input 
                      type="email" 
                      required 
                      className="nb-input" 
                      placeholder="seu.email@exemplo.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Qual seu objetivo ou dúvida técnica?</label>
                    <textarea 
                      required 
                      rows={4}
                      className="nb-textarea" 
                      placeholder="Descreva brevemente no que você precisa de apoio..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isSubmitting}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '8px' }}
                    disabled={isSubmitting}
                  >
                    <Send size={16} />
                    <span>{isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
