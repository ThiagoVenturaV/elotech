import React, { useEffect, useState } from 'react';
import { Compass, BookOpen, MapPin, Clock, ArrowRight, Award } from 'lucide-react';

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

interface HomeProps {
  onNavigate: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManifesto, setShowManifesto] = useState(false);

  useEffect(() => {
    fetch('/api/bootcamps')
      .then(res => res.json())
      .then(data => {
        setBootcamps(data.slice(0, 3)); // Pegar apenas os 3 primeiros para a home
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar bootcamps:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="nb-card mb-32" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center', padding: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}>
          <div className="nb-badge badge-magenta" style={{ fontSize: '12px' }}>
            Tecnologia com Raízes
          </div>
          
          <h1 style={{ fontSize: '48px', lineHeight: '1.1', margin: 0 }}>
            Bootcamps <span className="text-magenta">Transformadores</span>
          </h1>
          
          <p style={{ fontSize: '18px', color: 'var(--color-gray-dark)', margin: 0 }}>
            Forjando a soberania tecnológica através da identidade trans e da cultura nordestina. 
            Aprenda as habilidades do futuro honrando o conhecimento ancestral e com vaga garantida ou entrevista direta em empresas parceiras.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <button className="btn btn-primary" onClick={() => onNavigate('bootcamps')}>
              <Compass size={18} />
              <span>Ver Bootcamps</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setShowManifesto(true)}>
              <span>Nossa História</span>
            </button>
          </div>
        </div>
        
        {/* Diamond Illustration Container */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: '100%', minHeight: '300px' }}>
          <div style={{ 
            width: '280px', 
            height: '280px', 
            border: '3px solid var(--color-dark)', 
            backgroundColor: '#1E2022',
            transform: 'rotate(45deg)',
            overflow: 'hidden',
            boxShadow: '8px 8px 0px var(--color-magenta)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ transform: 'rotate(-45deg) scale(1.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#FFFFFF', textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-heading)', color: 'var(--color-magenta-light)' }}>
                Soberania Tech
              </div>
              <div style={{ fontSize: '12px', marginTop: '8px', color: '#9CA3AF', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Orgulho & Código
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bootcamps em Aberto Title */}
      <div className="flex-between mb-24">
        <div>
          <h2 style={{ fontSize: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen size={28} className="text-magenta" />
            <span>Bootcamps em Aberto</span>
          </h2>
          <p style={{ color: 'var(--color-gray)' }}>Vagas limitadas para a próxima turma com contratação inclusiva.</p>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={() => onNavigate('bootcamps')}
          style={{ textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>Ver Todos</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Bootcamps Grid */}
      <section className="grid-3 mb-32">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="nb-card" style={{ height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              Carregando oportunidade...
            </div>
          ))
        ) : (
          bootcamps.map((b, index) => {
            // Cores do lado esquerdo do card
            const borderColors = ['#005691', '#B33B72', '#D97706'];
            const accentColor = borderColors[index % borderColors.length];
            const badgeClasses = [
              'badge-blue',
              'badge-magenta',
              'badge-orange'
            ];
            const badgeClass = badgeClasses[index % badgeClasses.length];

            return (
              <div 
                key={b.id} 
                className="nb-card nb-card-hover" 
                style={{ 
                  borderLeft: `8px solid ${accentColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '340px'
                }}
              >
                <div>
                  <div className="flex-between mb-16">
                    <span className={`nb-badge ${badgeClass}`}>
                      {b.status === 'aberto' ? 'Inscrições Abertas' : b.status === 'andamento' ? 'Em Andamento' : 'Em Breve'}
                    </span>
                    <span style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-gray-dark)' }}>
                      <MapPin size={14} />
                      {b.location}
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>{b.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-gray-dark)', marginBottom: '16px' }}>{b.description}</p>
                  
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {b.tags.map(t => (
                      <span key={t} className="nb-badge" style={{ fontSize: '10px', padding: '2px 6px' }}>{t}</span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '2px solid var(--color-gray-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                    <Clock size={14} />
                    <span>{b.duration}</span>
                  </div>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); onNavigate('bootcamps'); }}
                    className="text-magenta" 
                    style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase' }}
                  >
                    <span>{b.status === 'aberto' ? 'Inscreva-se' : b.status === 'andamento' ? 'Lista de Espera' : 'Avise-me'}</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Two columns section (Community and Testimonial) */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
        {/* Left card */}
        <div className="nb-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '340px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div className="nb-badge badge-magenta" style={{ padding: '8px' }}>
                <Award size={20} className="text-magenta" />
              </div>
              <h3 style={{ fontSize: '28px' }}>Tecnologia Feita à Mão. Comunidade de Verdade.</h3>
            </div>
            
            <p style={{ color: 'var(--color-gray-dark)', fontSize: '16px', marginBottom: '24px' }}>
              Acreditamos que o código é poesia e a arquitetura é artesanato. Nossa comunidade apoia o desenvolvimento técnico de pessoas trans e aliadas, criando redes de apoio que vão além do terminal e proporcionando conexões reais com o mercado de trabalho.
            </p>
          </div>

          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setShowManifesto(true); }}
            className="text-magenta" 
            style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', fontSize: '14px' }}
          >
            <span>Leia o Manifesto Cordel</span>
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Right card (Testimonial) */}
        <div className="nb-card" style={{ backgroundColor: 'var(--color-magenta)', color: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '20px', padding: '32px' }}>
          <div style={{ 
            width: '90px', 
            height: '90px', 
            borderRadius: '50%', 
            border: '2px solid #FFFFFF', 
            overflow: 'hidden',
            boxShadow: '3px 3px 0px var(--color-dark)'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" 
              alt="Maria S." 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <p style={{ fontSize: '16px', fontStyle: 'italic', fontWeight: 500, lineHeight: '1.6' }}>
            "A EloTech não me deu apenas um curso de React, me deu uma guilda para chamar de minha e a oportunidade de entrar no Nubank como desenvolvedora."
          </p>
          <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--color-magenta-light)' }}>
            — MARIA S., DEV FRONTEND
          </div>
        </div>
      </section>

      {/* Manifesto Modal */}
      {showManifesto && (
        <div className="modal-overlay" onClick={() => setShowManifesto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowManifesto(false)}>X</button>
            <h3 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--color-magenta)' }}>Manifesto Cordel da Sobrevivência Tecnológica</h3>
            <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '14px', color: 'var(--color-gray-dark)' }}>
              {`No sertão da internet escura,
Onde a vaga de emprego é escassa,
A gente se une na raça,
E cria nossa própria estrutura.
Pessoa trans que estuda e programa,
Não aceita o papel de excluída,
Forja o código, vence na vida,
E acende a mais forte chama.

Não queremos apenas o código frio,
Nem a lógica que o mercado impõe,
Queremos a força de quem sonha e propõe,
E atravessa com coragem o rio.
A EloTech é ponte de apoio,
Com empresas que vêm somar,
Para a vaga de fato entregar,
E separar o trigo do joio.

A tecnologia é feita à mão,
Com as linhas do nosso viver,
Ninguém vai nos fazer esquecer
Que temos em nós a revolução.`}
            </div>
            <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={() => setShowManifesto(false)}>
              Compreendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
