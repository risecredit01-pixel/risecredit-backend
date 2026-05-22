import { useState, useEffect } from 'react';
import './AdminManagement.css';

const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/admin'
  : 'https://risecredit-api.onrender.com/api/admin';

function AdminAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('USA');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const token = sessionStorage.getItem('adminToken');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${API_BASE}/addresses?all=true`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  };

  useEffect(() => { fetchAddresses().then(d => { setAddresses(d); setLoading(false); }); }, []);

  const clearForm = () => { setLabel(''); setStreet(''); setCity(''); setState(''); setZip(''); setCountry('USA'); };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!label.trim() || !street.trim() || !city.trim() || !state.trim() || !zip.trim()) return;
    setSubmitting(true); setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/addresses`, { method: 'POST', headers, body: JSON.stringify({ label: label.trim(), street: street.trim(), city: city.trim(), state: state.trim(), zip: zip.trim(), country: country.trim() }) });
      const data = await res.json();
      if (data.success) { setStatus({ type: 'success', text: 'Added!' }); clearForm(); setAddresses(await fetchAddresses()); }
      else setStatus({ type: 'error', text: data.message });
    } catch { setStatus({ type: 'error', text: 'Network error.' }); }
    finally { setSubmitting(false); }
  };

  const startEdit = (item) => { setEditingId(item._id); setEditData({ label: item.label, street: item.street, city: item.city, state: item.state, zip: item.zip, country: item.country }); };
  const cancelEdit = () => { setEditingId(null); setEditData({}); };
  const handleEditChange = (field, value) => setEditData(prev => ({ ...prev, [field]: value }));

  const handleUpdate = async (id) => {
    if (!editData.label?.trim() || !editData.street?.trim() || !editData.city?.trim() || !editData.state?.trim() || !editData.zip?.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/addresses/${id}`, { method: 'PUT', headers, body: JSON.stringify(editData) });
      const data = await res.json();
      if (data.success) { setEditingId(null); setAddresses(await fetchAddresses()); setStatus({ type: 'success', text: 'Updated!' }); }
      else setStatus({ type: 'error', text: data.message });
    } catch { setStatus({ type: 'error', text: 'Network error.' }); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const res = await fetch(`${API_BASE}/addresses/${id}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (data.success) { setAddresses(await fetchAddresses()); setStatus({ type: 'success', text: 'Deleted' }); }
    } catch { setStatus({ type: 'error', text: 'Network error.' }); }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/addresses/${id}/toggle`, { method: 'PATCH', headers });
      const data = await res.json();
      if (data.success) { setAddresses(await fetchAddresses()); setStatus({ type: 'success', text: data.message }); }
    } catch { setStatus({ type: 'error', text: 'Network error.' }); }
  };

  return (
    <div className="admin-mgmt">
      <h2>📍 Addresses</h2>
      <p>Manage office addresses displayed on the Contact page. Inactive items are hidden from the website.</p>
      <form className="admin-mgmt__form" onSubmit={handleAdd}>
        <div className="admin-mgmt__field"><label>Label</label><input type="text" placeholder="e.g. Corporate Headquarters" value={label} onChange={e => setLabel(e.target.value)} required /></div>
        <div className="admin-mgmt__field"><label>Street</label><input type="text" placeholder="e.g. 1246 W 87th St" value={street} onChange={e => setStreet(e.target.value)} required /></div>
        <div className="admin-mgmt__field"><label>City</label><input type="text" placeholder="e.g. Chicago" value={city} onChange={e => setCity(e.target.value)} required /></div>
        <div className="admin-mgmt__field" style={{ maxWidth: '100px' }}><label>State</label><input type="text" placeholder="e.g. IL" value={state} onChange={e => setState(e.target.value)} required /></div>
        <div className="admin-mgmt__field" style={{ maxWidth: '120px' }}><label>ZIP</label><input type="text" placeholder="e.g. 60620" value={zip} onChange={e => setZip(e.target.value)} required /></div>
        <div className="admin-mgmt__field" style={{ maxWidth: '120px' }}><label>Country</label><input type="text" placeholder="e.g. USA" value={country} onChange={e => setCountry(e.target.value)} /></div>
        <button type="submit" className="btn-add" disabled={submitting}>{submitting ? 'Adding...' : '+ Add Address'}</button>
      </form>
      {status && <div className={`admin-mgmt__status admin-mgmt__status--${status.type}`}>{status.type === 'success' ? '✓' : '✕'} {status.text}</div>}
      {loading ? <div className="admin-mgmt__loading">Loading...</div> : addresses.length === 0 ? (
        <div className="admin-mgmt__empty"><div className="admin-mgmt__empty-icon">📍</div><p>No addresses yet.</p></div>
      ) : (
        <div className="admin-mgmt__table-wrap">
          <table className="admin-mgmt__table">
            <thead><tr><th>Label</th><th>Street</th><th>City</th><th>State</th><th>ZIP</th><th>Country</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {addresses.map(item => (
                <tr key={item._id} className={item.isActive === false ? 'row-inactive' : ''}>
                  {editingId === item._id ? (<>
                    <td><input className="admin-mgmt__inline-input" value={editData.label} onChange={e => handleEditChange('label', e.target.value)} /></td>
                    <td><input className="admin-mgmt__inline-input" value={editData.street} onChange={e => handleEditChange('street', e.target.value)} /></td>
                    <td><input className="admin-mgmt__inline-input" value={editData.city} onChange={e => handleEditChange('city', e.target.value)} /></td>
                    <td><input className="admin-mgmt__inline-input" style={{ minWidth: '60px' }} value={editData.state} onChange={e => handleEditChange('state', e.target.value)} /></td>
                    <td><input className="admin-mgmt__inline-input" style={{ minWidth: '70px' }} value={editData.zip} onChange={e => handleEditChange('zip', e.target.value)} /></td>
                    <td><input className="admin-mgmt__inline-input" style={{ minWidth: '70px' }} value={editData.country} onChange={e => handleEditChange('country', e.target.value)} /></td>
                    <td><span className={`status-badge ${item.isActive !== false ? 'status-active' : 'status-inactive'}`}>{item.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                    <td className="admin-mgmt__actions"><button className="btn-save" onClick={() => handleUpdate(item._id)}>Save</button><button className="btn-cancel" onClick={cancelEdit}>Cancel</button></td>
                  </>) : (<>
                    <td><strong>{item.label}</strong></td><td>{item.street}</td><td>{item.city}</td><td>{item.state}</td><td>{item.zip}</td><td>{item.country}</td>
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
export default AdminAddresses;
