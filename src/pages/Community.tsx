import React, { useEffect, useState } from 'react';
import { MessageSquare, Heart, Share2, Plus, TrendingUp, Users, UserPlus, UserCheck } from 'lucide-react';

interface Post {
  id: string;
  author_name: string;
  author_role: string;
  title: string;
  content: string;
  likes: number;
  responses: number;
  tags: string[];
  created_at: string;
}

export const Community: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<'recent' | 'popular'>('recent');
  const [loading, setLoading] = useState(true);

  // Novo Tópico Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postTag, setPostTag] = useState('Dúvida Técnica');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Seguir Membros (Simulação)
  const [followedMembers, setFollowedMembers] = useState<string[]>([]);

  const fetchPosts = () => {
    setLoading(true);
    fetch('/api/community')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar posts da comunidade:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = (postId: string) => {
    // Simulação visual de incremento de like local
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    fetch('/api/community', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        author_name: authorName,
        author_role: authorRole || 'Estudante',
        title: title,
        content: content,
        tags: [postTag]
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Falha ao criar post');
        return res.json();
      })
      .then(() => {
        setIsSubmitting(false);
        setShowCreateModal(false);
        setAuthorName('');
        setAuthorRole('');
        setTitle('');
        setContent('');
        fetchPosts(); // Recarregar feed
      })
      .catch(err => {
        console.error('Erro ao criar post:', err);
        setIsSubmitting(false);
        alert('Erro ao publicar. Tente novamente.');
      });
  };

  const toggleFollow = (name: string) => {
    setFollowedMembers(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const getSortedPosts = () => {
    if (filter === 'popular') {
      return [...posts].sort((a, b) => b.likes - a.likes);
    }
    return posts; // API já retorna ordenado por recentes
  };

  return (
    <div className="community-page">
      {/* Title block */}
      <div className="flex-between mb-32" style={{ borderBottom: '3px solid var(--color-dark)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <h2 style={{ fontSize: '36px' }}>Puxa a cadeira.</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn" 
              style={{ 
                padding: '6px 16px', 
                fontSize: '13px', 
                backgroundColor: filter === 'recent' ? 'var(--color-white)' : 'transparent',
                border: filter === 'recent' ? 'var(--border-main)' : 'none',
                boxShadow: filter === 'recent' ? 'var(--shadow-sm)' : 'none'
              }}
              onClick={() => setFilter('recent')}
            >
              Recentes
            </button>
            <button 
              className="btn" 
              style={{ 
                padding: '6px 16px', 
                fontSize: '13px', 
                backgroundColor: filter === 'popular' ? 'var(--color-white)' : 'transparent',
                border: filter === 'popular' ? 'var(--border-main)' : 'none',
                boxShadow: filter === 'popular' ? 'var(--shadow-sm)' : 'none'
              }}
              onClick={() => setFilter('popular')}
            >
              Em Alta
            </button>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          <span>Novo Tópico</span>
        </button>
      </div>

      {/* Main Grid: Feed + Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
        {/* Feed Columns */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="nb-card" style={{ height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                Carregando postagens...
              </div>
            ))
          ) : getSortedPosts().length === 0 ? (
            <div className="nb-card" style={{ textAlign: 'center', padding: '48px' }}>
              <p>Nenhuma postagem criada ainda. Seja a primeira a iniciar uma conversa!</p>
            </div>
          ) : (
            getSortedPosts().map(post => (
              <article key={post.id} className="nb-card">
                {/* Author Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      border: '2px solid var(--color-dark)', 
                      backgroundColor: 'var(--color-gray-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {post.author_name.charAt(0)}
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '15px' }}>{post.author_name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--color-gray)', marginLeft: '8px' }}>
                        {post.author_role}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {post.tags.map(tag => (
                      <span key={tag} className="nb-badge badge-magenta" style={{ fontSize: '10px', padding: '2px 8px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{post.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-gray-dark)', marginBottom: '20px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {post.content}
                </p>

                {/* Footer details */}
                <div style={{ display: 'flex', justifySelf: 'start', gap: '24px', fontSize: '13px', color: 'var(--color-gray)', borderTop: '1px solid var(--color-gray-light)', paddingTop: '12px', width: '100%' }}>
                  <button 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit', fontWeight: 600 }}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart size={16} className="text-magenta" style={{ fill: post.likes > 42 ? 'var(--color-magenta)' : 'none' }} />
                    <span>{post.likes} Likes</span>
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <MessageSquare size={16} className="text-blue" />
                    <span>{post.responses} Respostas</span>
                  </div>
                  <button 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit', fontWeight: 600, marginLeft: 'auto' }}
                    onClick={() => alert('Link copiado para a área de transferência!')}
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        {/* Sidebar Column */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Tópicos Quentes */}
          <div className="nb-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid var(--color-dark)', paddingBottom: '10px', marginBottom: '16px' }}>
              <TrendingUp size={18} className="text-magenta" />
              <span>Tópicos Quentes</span>
            </h3>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ fontSize: '13px', borderBottom: '1px solid var(--color-gray-light)', paddingBottom: '8px' }}>
                <a href="#" style={{ fontWeight: 600 }} onClick={e => e.preventDefault()}>Mentoria coletiva de currículo amanhã</a>
                <div style={{ color: 'var(--color-gray)', fontSize: '11px', marginTop: '2px' }}>120 respostas</div>
              </li>
              <li style={{ fontSize: '13px', borderBottom: '1px solid var(--color-gray-light)', paddingBottom: '8px' }}>
                <a href="#" style={{ fontWeight: 600 }} onClick={e => e.preventDefault()}>Como lidar com a síndrome do impostor?</a>
                <div style={{ color: 'var(--color-gray)', fontSize: '11px', marginTop: '2px' }}>85 respostas</div>
              </li>
              <li style={{ fontSize: '13px' }}>
                <a href="#" style={{ fontWeight: 600 }} onClick={e => e.preventDefault()}>Vagas afirmativas na Gupy: Estratégias</a>
                <div style={{ color: 'var(--color-gray)', fontSize: '11px', marginTop: '2px' }}>64 respostas</div>
              </li>
            </ul>
          </div>

          {/* Rede Ativa */}
          <div className="nb-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid var(--color-dark)', paddingBottom: '10px', marginBottom: '16px' }}>
              <Users size={18} className="text-blue" />
              <span>Rede Ativa</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Luiza Mota', role: 'Mentora Destaque' },
                { name: 'Beto C.', role: 'Top Contribuidor' }
              ].map(member => {
                const isFollowed = followedMembers.includes(member.name);
                return (
                  <div key={member.name} className="flex-between">
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        border: '1.5px solid var(--color-dark)', 
                        backgroundColor: 'var(--color-gray-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '11px'
                      }}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>{member.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-magenta)', fontWeight: 600 }}>{member.role}</div>
                      </div>
                    </div>
                    <button 
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      onClick={() => toggleFollow(member.name)}
                    >
                      {isFollowed ? (
                        <UserCheck size={18} className="text-blue" />
                      ) : (
                        <UserPlus size={18} className="text-gray" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Create Topic Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => { if (!isSubmitting) setShowCreateModal(false); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <button className="modal-close" onClick={() => setShowCreateModal(false)} disabled={isSubmitting}>X</button>
            <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Criar Novo Tópico</h3>
            
            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Seu Nome</label>
                <input 
                  type="text" 
                  required 
                  className="nb-input" 
                  placeholder="Seu nome completo ou social"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Sua Função / Status (Opcional)</label>
                <input 
                  type="text" 
                  className="nb-input" 
                  placeholder="Ex: Estudante, Dev Frontend, Backend Jr"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Título do Tópico</label>
                  <input 
                    type="text" 
                    required 
                    className="nb-input" 
                    placeholder="Título resumido da sua publicação"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Categoria</label>
                  <select 
                    className="nb-select"
                    value={postTag}
                    onChange={(e) => setPostTag(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="Dúvida Técnica">Dúvida</option>
                    <option value="Vitória">Vitória</option>
                    <option value="Primeiro Emprego">Emprego</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Conteúdo da Publicação</label>
                <textarea 
                  required 
                  rows={6}
                  className="nb-textarea" 
                  placeholder="Escreva aqui sua dúvida, conquista ou relato..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isSubmitting}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-magenta" 
                style={{ width: '100%', marginTop: '8px' }}
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Publicando...' : 'Publicar Tópico'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
