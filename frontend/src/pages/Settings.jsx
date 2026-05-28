import Navbar from '../components/Navbar';
import { User, Bell, Shield, Paintbrush } from 'lucide-react';

export default function Settings() {
  return (
    <div className="app-container animate-fade-in">
      <Navbar />
      <div style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Account Settings</h1>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Sidebar */}
          <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.1)', justifyContent: 'flex-start', boxShadow: 'none' }}><User size={18} style={{marginRight:'10px'}}/> Profile Info</button>
            <button className="btn-primary" style={{ background: 'transparent', justifyContent: 'flex-start', boxShadow: 'none', color: 'var(--text-muted)' }}><Bell size={18} style={{marginRight:'10px'}}/> Notifications</button>
            <button className="btn-primary" style={{ background: 'transparent', justifyContent: 'flex-start', boxShadow: 'none', color: 'var(--text-muted)' }}><Paintbrush size={18} style={{marginRight:'10px'}}/> Appearance</button>
            <button className="btn-primary" style={{ background: 'transparent', justifyContent: 'flex-start', boxShadow: 'none', color: 'var(--text-muted)' }}><Shield size={18} style={{marginRight:'10px'}}/> Privacy & Security</button>
          </div>

          {/* Content */}
          <div className="glass-panel" style={{ flex: 1, padding: '2.5rem' }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Profile Information</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                JD
              </div>
              <div>
                <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Upload Avatar</button>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="input-field" defaultValue="John Doe" />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="input-field" defaultValue="john.doe@example.com" />
            </div>

            <div className="form-group">
              <label className="form-label">Target Role</label>
              <select className="input-field">
                <option>Software Engineer (Backend)</option>
                <option>Software Engineer (Frontend)</option>
                <option>Data Scientist</option>
                <option>Product Manager</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button className="btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
