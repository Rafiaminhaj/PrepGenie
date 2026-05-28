import { useState, useEffect } from 'react';
import { Briefcase, Plus, X, Building, MapPin, Calendar, DollarSign, ExternalLink, GripVertical } from 'lucide-react';

const COLUMNS = {
  applied: { id: 'applied', title: 'Applied', color: '#3b82f6' },
  interviewing: { id: 'interviewing', title: 'Interviewing', color: '#8b5cf6' },
  offered: { id: 'offered', title: 'Offered', color: '#10b981' },
  rejected: { id: 'rejected', title: 'Rejected', color: '#ef4444' }
};

export default function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({ company: '', role: '', location: '', salary: '', link: '', status: 'applied' });
  const [draggedJobId, setDraggedJobId] = useState(null);

  // Load from Supabase
  useEffect(() => {
    import('../lib/supabase').then(async ({ supabase }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from('saved_jobs').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (data && !error) {
          // Map to local state format
          const mappedJobs = data.map(j => ({
            id: j.id,
            company: j.company,
            role: j.role,
            location: 'Remote/Office', // Dummy if not in schema
            salary: 'TBD', // Dummy if not in schema
            status: j.status,
            date: j.applied_date || new Date(j.created_at).toLocaleDateString()
          }));
          setJobs(mappedJobs);
        }
      }
    });
  }, []);

  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!newJob.company || !newJob.role) return;

    import('../lib/supabase').then(async ({ supabase }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from('saved_jobs').insert([{
          user_id: user.id,
          company: newJob.company,
          role: newJob.role,
          status: newJob.status,
          applied_date: new Date().toISOString().split('T')[0]
        }]).select().single();

        if (data && !error) {
          const jobEntry = {
            id: data.id,
            company: data.company,
            role: data.role,
            location: newJob.location || 'N/A',
            salary: newJob.salary || 'N/A',
            status: data.status,
            date: new Date().toLocaleDateString()
          };
          setJobs([...jobs, jobEntry]);
        }
      }
    });

    setIsModalOpen(false);
    setNewJob({ company: '', role: '', location: '', salary: '', link: '', status: 'applied' });
  };

  const deleteJob = async (id) => {
    import('../lib/supabase').then(async ({ supabase }) => {
      await supabase.from('saved_jobs').delete().eq('id', id);
    });
    setJobs(jobs.filter(j => j.id !== id));
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e, id) => {
    setDraggedJobId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Small timeout to allow the visual drag image to capture the element before we dim it
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedJobId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    if (!draggedJobId) return;

    import('../lib/supabase').then(async ({ supabase }) => {
      await supabase.from('saved_jobs').update({ status: columnId }).eq('id', draggedJobId);
    });

    setJobs(jobs.map(job => {
      if (job.id === draggedJobId) {
        return { ...job, status: columnId };
      }
      return job;
    }));
    setDraggedJobId(null);
  };

  return (
    <div className="main-content animate-fade-in" style={{ padding: '2rem', marginLeft: '80px', marginTop: '20px', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Briefcase size={36} color="var(--primary)" /> Application Tracker
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Drag and drop to track your hiring pipeline. Add new applications to earn +15 XP!</p>
        </div>
        
        <button 
          className="btn-primary premium-3d" 
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '12px 24px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
        >
          <Plus size={20} /> Add Application
        </button>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {Object.values(COLUMNS).map(column => (
          <div 
            key={column.id} 
            className="glass-panel kanban-column"
            style={{ 
              background: 'rgba(20, 20, 30, 0.6)', 
              minHeight: '60vh', 
              padding: '1rem', 
              borderRadius: '16px',
              borderTop: `4px solid ${column.color}`,
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
            }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.5px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: column.color, boxShadow: `0 0 15px ${column.color}` }}></div>
                {column.title}
              </h3>
              <span style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.1), ${column.color}40)`, padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', border: `1px solid ${column.color}40` }}>
                {jobs.filter(j => j.status === column.id).length}
              </span>
            </div>

            {/* Cards Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {jobs.filter(j => j.status === column.id).map(job => (
                <div 
                  key={job.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, job.id)}
                  onDragEnd={handleDragEnd}
                  className="glass-panel module-card"
                  style={{ 
                    padding: '1.5rem', 
                    cursor: 'grab', 
                    background: 'linear-gradient(145deg, rgba(30, 30, 45, 0.9), rgba(15, 15, 25, 0.9))',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderLeft: `4px solid ${column.color}`,
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.boxShadow = `0 15px 35px ${column.color}30`;
                    e.currentTarget.style.border = `1px solid ${column.color}60`;
                    e.currentTarget.style.borderLeft = `4px solid ${column.color}`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)';
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderLeft = `4px solid ${column.color}`;
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: `radial-gradient(circle at top right, ${column.color}20, transparent)`, pointerEvents: 'none' }}></div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '6px', letterSpacing: '0.3px' }}>{job.role}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: column.color, fontWeight: '700', fontSize: '1rem', background: `${column.color}15`, padding: '4px 10px', borderRadius: '8px', display: 'inline-flex' }}>
                        <Building size={16} /> {job.company}
                      </div>
                    </div>
                    <button onClick={() => deleteJob(job.id)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(239, 68, 68, 0.2)'} onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
                      <X size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {job.location && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} color="rgba(255,255,255,0.4)" /> {job.location}</div>}
                    {job.salary && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><DollarSign size={16} color="#10b981" /> <span style={{ color: '#10b981', fontWeight: '600' }}>{job.salary}</span></div>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} color="rgba(255,255,255,0.4)" /> Applied: <span style={{ color: '#e2e8f0' }}>{job.date}</span></div>
                  </div>
                  
                  {job.link && (
                    <a href={job.link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '1.2rem', fontSize: '0.9rem', fontWeight: '600', color: '#3b82f6', textDecoration: 'none', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 12px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(59, 130, 246, 0.2)'} onMouseLeave={e => e.currentTarget.style.background='rgba(59, 130, 246, 0.1)'}>
                      <ExternalLink size={16} /> View Posting
                    </a>
                  )}
                  
                  <div style={{ position: 'absolute', bottom: '15px', right: '15px', opacity: 0.2, cursor: 'grab' }}>
                    <GripVertical size={20} />
                  </div>
                </div>
              ))}
              
              {jobs.filter(j => j.status === column.id).length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '1rem', fontWeight: '500', background: 'rgba(0,0,0,0.2)' }}>
                  Drag applications here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel premium-3d cascade-reveal" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#fff' }}>Add Application</h2>
            
            <form onSubmit={handleAddJob}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input required type="text" className="input-field" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} placeholder="e.g. Google" />
              </div>
              <div className="form-group">
                <label className="form-label">Role *</label>
                <input required type="text" className="input-field" value={newJob.role} onChange={e => setNewJob({...newJob, role: e.target.value})} placeholder="e.g. Frontend Engineer" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input type="text" className="input-field" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} placeholder="e.g. Remote" />
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Salary</label>
                  <input type="text" className="input-field" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} placeholder="e.g. 20 LPA" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Job Posting URL</label>
                <input type="url" className="input-field" value={newJob.link} onChange={e => setNewJob({...newJob, link: e.target.value})} placeholder="https://..." />
              </div>
              
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', fontSize: '1.1rem' }}>
                Save Application
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
