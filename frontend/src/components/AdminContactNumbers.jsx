import { useState, useEffect } from 'react';
import './AdminManagement.css';

const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/admin'
  : 'https://risecredit-api.onrender.com/api/admin';

function AdminContactNumbers() {
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const token = sessionStorage.getItem('adminToken');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const fetchNumbers = async () => {
    try {
      const res = await fetch(`${API_BASE}/contact-numbers?all=true`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) { return []; }
  };

  useEffect(() => { fetchNumbers().then(d => { setNumbers(d); setLoading(false); }); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!label.trim() || !phone.trim()) return;
    setSubmitting(true); setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/contact-numbers`, { method: 'POST', headers, body: JSON.stringify({ label: label.trim(), phone: phone.trim() }) });
      const data = await res.json();
      if (data.success) { setStatus({ type: 'success', text: 'Added!' }); setLabel(''); setPhone(''); setNumbers(await fetchNumbers()); }
      else setStatus({ type: 'error', text: data.message });
    } catch { setStatus({ type: 'error', text: 'Network error.' }); }
    finally { setSubmitting(false); }
  };

  const startEdit = (item) => { setEditingId(item._id); setEditLabel(item.label); setEditPhone(item.phone); };
  const cancelEdit = () => { setEditingId(null); };

  const handleUpdate = async (id) => {
    if (!editLabel.trim() || !editPhone.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/contact-numbers/${id}`, { method: 'PUT', headers, body: JSON.stringify({ label: editLabel.trim(), phone: editPhone.trim() }) });
      const data = await res.json();
      if (data.success) { setEditingId(null); setNumbers(await fetchNumbers()); setStatus({ type: 'success', text: 'Updated!' }); }
      else setStatus({ type: 'error', text: data.message });
    } catch { setStatus({ type: 'error', text: 'Network error.' }); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact number?')) return;
    try {
      const res = await fetch(`${API_BASE}/contact-numbers/${id}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (data.success) { setNumbers(await fetchNumbers()); setStatus({ type: 'success', text: 'Deleted' }); }
    } catch { setStatus({ type: 'error', text: 'Network error.' }); }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/contact-numbers/${id}/toggle`, { method: 'PATCH', headers });
      const data = await res.json();
      if (data.success) { setNumbers(await fetchNumbers()); setStatus({ type: 'success', text: data.message }); }
    } catch { setStatus({ type: 'error', text: 'Network error.' }); }
  };

  return (
    <div className="admin-mgmt">
      <h2>📞 Contact Numbers</h2>
      <p>Manage phone numbers displayed on the Contact page. Inactive items are hidden from the website.</p>
      <form className="admin-mgmt__form" onSubmit={handleAdd}>
        <div className="admin-mgmt__field"><label>Label</label><input type="text" placeholder="e.g. Customer Support" value={label} onChange={e => setLabel(e.target.value)} required /></div>
        <div className="admin-mgmt__field"><label>Phone Number</label><input type="tel" placeholder="e.g. +1 (830) 353-9921" value={phone} onChange={e => setPhone(e.target.value)} required /></div>
        <button type="submit" className="btn-add" disabled={submitting}>{submitting ? 'Adding...' : '+ Add Number'}</button>
      </form>
      {status && <div className={`admin-mgmt__status admin-mgmt__status--${status.type}`}>{status.type === 'success' ? '✓' : '✕'} {status.text}</div>}
      {loading ? <div className="admin-mgmt__loading">Loading...</div> : numbers.length === 0 ? (
        <div className="admin-mgmt__empty"><div className="admin-mgmt__empty-icon">📞</div><p>No contact numbers yet.</p></div>
      ) : (
        <div className="admin-mgmt__table-wrap">
          <table className="admin-mgmt__table">
            <thead><tr><th>Label</th><th>Phone</th><th>Status</th><th>Added</th><th>Actions</th></tr></thead>
            <tbody>
              {numbers.map(item => (
                <tr key={item._id} className={item.isActive === false ? 'row-inactive' : ''}>
                  {editingId === item._id ? (<>
                    <td><input className="admin-mgmt__inline-input" value={editLabel} onChange={e => setEditLabel(e.target.value)} /></td>
                    <td><input className="admin-mgmt__inline-input" value={editPhone} onChange={e => setEditPhone(e.target.value)} /></td>
                    <td><span className={`status-badge ${item.isActive !== false ? 'status-active' : 'status-inactive'}`}>{item.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="admin-mgmt__actions"><button className="btn-save" onClick={() => handleUpdate(item._id)}>Save</button><button className="btn-cancel" onClick={cancelEdit}>Cancel</button></td>
                  </>) : (<>
                    <td>{item.label}</td><td>{item.phone}</td>
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
export default AdminContactNumbers;
