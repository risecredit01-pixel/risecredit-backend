import { useState, useEffect } from 'react';
import './AdminManagement.css';

const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/admin'
  : 'https://risecredit-api.onrender.com/api/admin';

function AdminEmails() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const token = sessionStorage.getItem('adminToken');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const fetchEmails = async () => {
    try {
      const res = await fetch(`${API_BASE}/emails?all=true`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  };

  useEffect(() => { fetchEmails().then(d => { setEmails(d); setLoading(false); }); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!label.trim() || !email.trim()) return;
    setSubmitting(true); setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/emails`, { method: 'POST', headers, body: JSON.stringify({ label: label.trim(), email: email.trim() }) });
      const data = await res.json();
      if (data.success) { setStatus({ type: 'success', text: 'Added!' }); setLabel(''); setEmail(''); setEmails(await fetchEmails()); }
      else setStatus({ type: 'error', text: data.message });
    } catch { setStatus({ type: 'error', text: 'Network error.' }); }
    finally { setSubmitting(false); }
  };

  const startEdit = (item) => { setEditingId(item._id); setEditLabel(item.label); setEditEmail(item.email); };
  const cancelEdit = () => { setEditingId(null); };

  const handleUpdate = async (id) => {
    if (!editLabel.trim() || !editEmail.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/emails/${id}`, { method: 'PUT', headers, body: JSON.stringify({ label: editLabel.trim(), email: editEmail.trim() }) });
      const data = await res.json();
      if (data.success) { setEditingId(null); setEmails(await fetchEmails()); setStatus({ type: 'success', text: 'Updated!' }); }
      else setStatus({ type: 'error', text: data.message });
    } catch { setStatus({ type: 'error', text: 'Network error.' }); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this email?')) return;
    try {
      const res = await fetch(`${API_BASE}/emails/${id}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (data.success) { setEmails(await fetchEmails()); setStatus({ type: 'success', text: 'Deleted' }); }
    } catch { setStatus({ type: 'error', text: 'Network error.' }); }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/emails/${id}/toggle`, { method: 'PATCH', headers });
      const data = await res.json();
      if (data.success) { setEmails(await fetchEmails()); setStatus({ type: 'success', text: data.message }); }
    } catch { setStatus({ type: 'error', text: 'Network error.' }); }
  };

  return (
    <div className="admin-mgmt">
      <h2>✉️ Email IDs</h2>
      <p>Manage email addresses displayed on the Contact page. Inactive items are hidden from the website.</p>
      <form className="admin-mgmt__form" onSubmit={handleAdd}>
        <div className="admin-mgmt__field"><label>Label</label><input type="text" placeholder="e.g. Email Support" value={label} onChange={e => setLabel(e.target.value)} required /></div>
        <div className="admin-mgmt__field"><label>Email Address</label><input type="email" placeholder="e.g. support@risecredit.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
        <button type="submit" className="btn-add" disabled={submitting}>{submitting ? 'Adding...' : '+ Add Email'}</button>
      </form>
      {status && <div className={`admin-mgmt__status admin-mgmt__status--${status.type}`}>{status.type === 'success' ? '✓' : '✕'} {status.text}</div>}
      {loading ? <div className="admin-mgmt__loading">Loading...</div> : emails.length === 0 ? (
        <div className="admin-mgmt__empty"><div className="admin-mgmt__empty-icon">✉️</div><p>No emails yet.</p></div>
      ) : (
        <div className="admin-mgmt__table-wrap">
          <table className="admin-mgmt__table">
            <thead><tr><th>Label</th><th>Email</th><th>Status</th><th>Added</th><th>Actions</th></tr></thead>
            <tbody>
              {emails.map(item => (
                <tr key={item._id} className={item.isActive === false ? 'row-inactive' : ''}>
                  {editingId === item._id ? (<>
                    <td><input className="admin-mgmt__inline-input" value={editLabel} onChange={e => setEditLabel(e.target.value)} /></td>
                    <td><input className="admin-mgmt__inline-input" type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} /></td>
                    <td><span className={`status-badge ${item.isActive !== false ? 'status-active' : 'status-inactive'}`}>{item.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="admin-mgmt__actions"><button className="btn-save" onClick={() => handleUpdate(item._id)}>Save</button><button className="btn-cancel" onClick={cancelEdit}>Cancel</button></td>
                  </>) : (<>
                    <td>{item.label}</td><td>{item.email}</td>
                    <td><span className={`status-badge ${item.isActive !== false ? 'status-active' : 'status-inactive'}`}>{item.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
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
export default AdminEmails;
