import React, { useEffect, useState } from 'react';
import { CheckCircle, RefreshCw, Edit, Briefcase } from 'lucide-react';

interface Application {
  id: string;
  user_id: string;
  user_name: string;
  email: string;
  bootcamp_id: string;
  bootcamp_title: string;
  company_name: string;
  status: string; // inscrita, cursando, concluida, contratada
  feedback: string;
}

export const Admin: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newFeedback, setNewFeedback] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchApplications = () => {
    setLoading(true);
    fetch('/api/applications')
      .then(res => res.json())
      .then(data => {
        setApplications(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar candidaturas:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    setIsUpdating(true);
    fetch('/api/applications', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: editingApp.id,
        status: newStatus,
        feedback: newFeedback.trim()
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao atualizar status');
        return res.json();
      })
      .then(() => {
        setIsUpdating(false);
        setEditingApp(null);
        fetchApplications();
      })
      .catch(err => {
        console.error('Erro ao atualizar status:', err);
        setIsUpdating(false);
        alert('Erro ao salvar alterações no status. Tente novamente.');
      });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'inscrita':
        return <span className="nb-badge badge-blue">Inscrita</span>;
      case 'cursando':
        return <span className="nb-badge" style={{ backgroundColor: 'var(--color-gray-light)' }}>Cursando</span>;
      case 'concluida':
        return <span className="nb-badge badge-orange">Concluída</span>;
      case 'contratada':
        return <span className="nb-badge badge-magenta" style={{ backgroundColor: '#22C55E', color: '#FFFFFF' }}>Contratada</span>;
      default:
        return <span className="nb-badge">{status}</span>;
    }
  };

  const totalApps = applications.length;
  const activeStudents = applications.filter(a => a.status === 'cursando').length;
  const totalHired = applications.filter(a => a.status === 'contratada').length;

  return (
    <div className="admin-page">
      {/* Upper stats banner */}
      <section className="nb-card mb-32" style={{ borderLeft: '8px solid var(--color-dark)' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Briefcase size={24} className="text-magenta" />
          <span>Painel de Empregabilidade Trans</span>
        </h2>
        <p style={{ color: 'var(--color-gray-dark)', fontSize: '15px' }}>
          Acompanhamento e evolução profissional. Empresas parceiras atualizam o status das alunas desde a matrícula no bootcamp até a contratação formal.
        </p>
      </section>

      {/* Stats Cards Row (Responsivo por CSS) */}
      <div className="mb-32" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="nb-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-gray)' }}>Total de Inscrições</div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>{totalApps}</div>
        </div>
        <div className="nb-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '6px solid var(--color-blue)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-blue)' }}>Candidatas Cursando</div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>{activeStudents}</div>
        </div>
        <div className="nb-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '6px solid #22C55E' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#22C55E' }}>Contratadas pelas Parceiras</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#22C55E' }}>{totalHired}</div>
        </div>
      </div>

      {/* Applications Table Container (Responsivo por CSS com admin-table-container) */}
      <div className="nb-card" style={{ padding: 0 }}>
        <div style={{ padding: '20px', borderBottom: '2px solid var(--color-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <h3 style={{ fontSize: '18px' }}>Controle de Candidaturas</h3>
          <button className="btn btn-secondary" style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: '12px', minHeight: '36px' }} onClick={fetchApplications}>
            <RefreshCw size={14} />
            <span>Atualizar Tabela</span>
          </button>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <span>Carregando candidaturas...</span>
            </div>
          ) : applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-gray-dark)' }}>
              Nenhuma candidatura registrada. Vá para o catálogo e inscreva-se em um bootcamp para ver o progresso aqui!
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr style={{ backgroundColor: 'var(--color-gray-light)', borderBottom: '2px solid var(--color-dark)' }}>
                  <th style={{ padding: '16px', fontWeight: 700 }}>Nome Social / Completo</th>
                  <th style={{ padding: '16px', fontWeight: 700 }}>E-mail</th>
                  <th style={{ padding: '16px', fontWeight: 700 }}>Bootcamp</th>
                  <th style={{ padding: '16px', fontWeight: 700 }}>Parceira</th>
                  <th style={{ padding: '16px', fontWeight: 700 }}>Status Atual</th>
                  <th style={{ padding: '16px', fontWeight: 700 }}>Acompanhamento / Notas</th>
                  <th style={{ padding: '16px', fontWeight: 700, textAlign: 'center' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} style={{ borderBottom: '2px solid var(--color-gray-light)' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{app.user_name}</td>
                    <td style={{ padding: '16px', color: 'var(--color-gray-dark)', fontSize: '13px' }}>{app.email}</td>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{app.bootcamp_title}</td>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{app.company_name}</td>
                    <td style={{ padding: '16px' }}>{getStatusBadge(app.status)}</td>
                    <td style={{ padding: '16px', fontSize: '13px', color: 'var(--color-gray-dark)', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {app.feedback || 'Sem observações'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button 
                        className="btn" 
                        style={{ padding: '6px 12px', fontSize: '12px', minHeight: '32px' }}
                        onClick={() => {
                          setEditingApp(app);
                          setNewStatus(app.status);
                          setNewFeedback(app.feedback || '');
                        }}
                      >
                        <Edit size={12} />
                        <span>Gerenciar</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Status Modal */}
      {editingApp && (
        <div className="modal-overlay" onClick={() => { if (!isUpdating) setEditingApp(null); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <button className="modal-close" onClick={() => setEditingApp(null)} disabled={isUpdating} aria-label="Fechar">X</button>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Gerenciar Candidata</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-gray-dark)', marginBottom: '20px' }}>
              Atualize o status profissional de <strong>{editingApp.user_name}</strong> no bootcamp <strong>{editingApp.bootcamp_title}</strong>.
            </p>

            <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Status Profissional</label>
                <select 
                  className="nb-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  disabled={isUpdating}
                >
                  <option value="inscrita">Inscrita (Candidata)</option>
                  <option value="cursando">Cursando o Bootcamp</option>
                  <option value="concluida">Concluído (Apta para contratação)</option>
                  <option value="contratada">Contratada pela Empresa</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Observações / Feedback Corporativo</label>
                <textarea 
                  rows={4}
                  className="nb-textarea" 
                  placeholder="Ex: Aprovada na primeira fase técnica; Entrevista agendada; Contratada como Dev Júnior."
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                  disabled={isUpdating}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {newStatus === 'contratada' && (
                <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '2px dashed #22C55E', padding: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <CheckCircle size={20} style={{ color: '#22C55E', flexShrink: 0 }} />
                  <p style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>
                    Ao selecionar 'Contratada', a candidata constará como contratada no banco de dados e nos indicadores da plataforma!
                  </p>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '8px' }}
                disabled={isUpdating}
              >
                <span>{isUpdating ? 'Atualizando...' : 'Confirmar Alterações'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
