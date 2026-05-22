import { useState, useEffect } from 'react';
import './AdminManagement.css';

const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/admin'
  : 'https://risecredit-api.onrender.com/api/admin';

function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bullets, setBullets] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editBullets, setEditBullets] = useState('');
  const [editLogo, setEditLogo] = useState('');

  const token = sessionStorage.getItem('adminToken');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const fetchPartners = async () => {
    try {
      const res = await fetch(`${API_BASE}/partners?all=true`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  };

  useEffect(() => { fetchPartners().then(d => { setPartners(d); setLoading(false); }); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    setSubmitting(true); setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/partners`, { method: 'POST', headers, body: JSON.stringify({ name: name.trim(), description: description.trim(), bullets: bullets.trim(), logoUrl: logoUrl.trim() }) });
      const data = await res.json();
      if (data.success) { setStatus({ type: 'success', text: 'Added!' }); setName(''); setDescription(''); setBullets(''); setLogoUrl(''); setPartners(await fetchPartners()); }
      else setStatus({ type: 'error', text: data.message });
    } catch { setStatus({ type: 'error', text: 'Network error.' }); }
    finally { setSubmitting(false); }
  };

  const startEdit = (item) => { setEditingId(item._id); setEditName(item.name); setEditDesc(item.description); setEditBullets(item.bullets ? item.bullets.join(', ') : ''); setEditLogo(item.logoUrl || ''); };
  const cancelEdit = () => { setEditingId(null); };

  const handleUpdate = async (id) => {
    if (!editName.trim() || !editDesc.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/partners/${id}`, { method: 'PUT', headers, body: JSON.stringify({ name: editName.trim(), description: editDesc.trim(), bullets: editBullets.trim(), logoUrl: editLogo.trim() }) });
      const data = await res.json();
      if (data.success) { setEditingId(null); setPartners(await fetchPartners()); setStatus({ type: 'success', text: 'Updated!' }); }
      else setStatus({ type: 'error', text: data.message });
    } catch { setStatus({ type: 'error', text: 'Network error.' }); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this partner?')) return;
    try {
      const res = await fetch(`${API_BASE}/partners/${id}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (data.success) { setPartners(await fetchPartners()); setStatus({ type: 'success', text: 'Deleted' }); }
    } catch { setStatus({ type: 'error', text: 'Network error.' }); }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/partners/${id}/toggle`, { method: 'PATCH', headers });
      const data = await res.json();
      if (data.success) { setPartners(await fetchPartners()); setStatus({ type: 'success', text: data.message }); }
    } catch { setStatus({ type: 'error', text: 'Network error.' }); }
  };

  return (
    <div className="admin-mgmt">
      <h2>🏦 Banking Partners</h2>
      <p>Manage banking partners displayed on the Partners page. Inactive items are hidden from the website.</p>
      <form className="admin-mgmt__form" onSubmit={handleAdd}>
        <div className="admin-mgmt__field"><label>Partner Name</label><input type="text" placeholder="e.g. Visa" value={name} onChange={e => setName(e.target.value)} required /></div>
        <div className="admin-mgmt__field"><label>Description</label><input type="text" placeholder="Brief description" value={description} onChange={e => setDescription(e.target.value)} required /></div>
        <div className="admin-mgmt__field"><label>Features (comma-separated)</label><input type="text" placeholder="e.g. Fast, Secure" value={bullets} onChange={e => setBullets(e.target.value)} /></div>
        <div className="admin-mgmt__field"><label>Logo URL (optional)</label><input type="url" placeholder="https://..." value={logoUrl} onChange={e => setLogoUrl(e.target.value)} /></div>
        <button type="submit" className="btn-add" disabled={submitting}>{submitting ? 'Adding...' : '+ Add Partner'}</button>
      </form>
      {status && <div className={`admin-mgmt__status admin-mgmt__status--${status.type}`}>{status.type === 'success' ? '✓' : '✕'} {status.text}</div>}
      {loading ? <div className="admin-mgmt__loading">Loading...</div> : partners.length === 0 ? (
        <div className="admin-mgmt__empty"><div className="admin-mgmt__empty-icon">🏦</div><p>No partners yet.</p></div>
      ) : (
        <div className="admin-mgmt__table-wrap">
          <table className="admin-mgmt__table">
            <thead><tr><th>Name</th><th>Description</th><th>Features</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {partners.map(item => (
                <tr key={item._id} className={item.isActive === false ? 'row-inactive' : ''}>
                  {editingId === item._id ? (<>
                    <td><input className="admin-mgmt__inline-input" value={editName} onChange={e => setEditName(e.target.value)} /></td>
                    <td><input className="admin-mgmt__inline-input" value={editDesc} onChange={e => setEditDesc(e.target.value)} /></td>
                    <td><input className="admin-mgmt__inline-input" value={editBullets} onChange={e => setEditBullets(e.target.value)} placeholder="comma-separated" /></td>
                    <td><span className={`status-badge ${item.isActive !== false ? 'status-active' : 'status-inactive'}`}>{item.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                    <td className="admin-mgmt__actions"><button className="btn-save" onClick={() => handleUpdate(item._id)}>Save</button><button className="btn-cancel" onClick={cancelEdit}>Cancel</button></td>
                  </>) : (<>
                    <td><strong>{item.name}</strong></td>
                    <td style={{ whiteSpace: 'normal', maxWidth: '250px' }}>{item.description}</td>
                    <td><div className="admin-mgmt__bullets">{item.bullets?.map((b, i) => <span key={i} className="admin-mgmt__bullet-tag">{b}</span>)}{(!item.bullets || item.bullets.length === 0) && '—'}</div></td>
                    <td><span className={`status-badge ${item.isActive !== false ? 'status-active' : 'status-inactive'}`}>{item.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                    <td className="admin-mgmt__actions">
                      <button className={item.isActive !== false ? 'btn-deactivate' : 'btn-activate'} onClick={() => handleToggle(item._id)}>{item.isActive !== false ? 'Deactivate' : 'Activate'}</button>
                      <button className="btn-edit" onClick={() => startEdit(item)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(item._id)}>Delete</button>
                    </td>
                  </>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default AdminPartners;
