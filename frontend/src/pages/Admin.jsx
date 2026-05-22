import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import AdminContactNumbers from '../components/AdminContactNumbers';
import AdminEmails from '../components/AdminEmails';
import AdminPartners from '../components/AdminPartners';
import AdminAddresses from '../components/AdminAddresses';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('applications');
  const [data, setData] = useState({
    applications: [],
    contacts: [],
    insurance: [],
    newsletters: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionStorage.getItem('adminToken')) {
      navigate('/');
      return;
    }
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('isAdminAuthenticated');
    navigate('/');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}` };
      const API_BASE = window.location.hostname === 'localhost'
        ? 'http://localhost:5000/api'
        : 'https://risecredit-api.onrender.com/api';
      const [appRes, contactRes, insRes, newsRes, logRes] = await Promise.all([
        fetch(`${API_BASE}/apply`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/contact`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/insurance`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/newsletter`, { headers }).then(res => res.json())
      ]);

      setData({
        applications: Array.isArray(appRes) ? appRes : [],
        contacts: Array.isArray(contactRes) ? contactRes : [],
        insurance: Array.isArray(insRes) ? insRes : [],
        newsletters: Array.isArray(newsRes) ? newsRes : []
      });
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    const activeData = data[activeTab];
    if (!activeData || activeData.length === 0) {
      alert('No data to download.');
      return;
    }

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(activeData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab);

    // Save file
    XLSX.writeFile(workbook, `RiseCredit_${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const deleteEntry = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this entry? This cannot be undone.')) return;
    
    let endpoint = '';
    if (activeTab === 'applications') endpoint = '/api/apply';
    else if (activeTab === 'contacts') endpoint = '/api/contact';
    else if (activeTab === 'insurance') endpoint = '/api/insurance';
    else if (activeTab === 'newsletters') endpoint = '/api/newsletter';

    try {
      const res = await fetch(`${endpoint}/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}` }
      });
      const result = await res.json();
      if (result.success) {
        fetchData(); // Refresh data after successful deletion
      } else {
        alert('Failed to delete: ' + result.message);
      }
    } catch (err) {
      alert('Network error while deleting.');
    }
  };

  const renderTable = () => {
    const activeData = data[activeTab];
    if (!activeData || activeData.length === 0) {
      return <div className="admin-empty">No {activeTab} found.</div>;
    }

    // Get all unique keys for columns (excluding mongoose specific fields if needed)
    const keys = Array.from(new Set(activeData.flatMap(Object.keys))).filter(key => key !== '__v');

    return (
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              {keys.map(key => <th key={key}>{key}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeData.map((row, idx) => (
              <tr key={idx}>
                {keys.map(key => {
                  let val = row[key];
                  if (typeof val === 'object' && val !== null) {
                    val = JSON.stringify(val);
                  }
                  return <td key={key}>{val?.toString() || ''}</td>;
                })}
                <td>
                  <button 
                    onClick={() => deleteEntry(row._id)} 
                    style={{ background: '#ff4d4f', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="admin-page">
        <div className="admin-header-flex">
          <div className="container">
            <h1>Admin Dashboard</h1>
            <p>Manage all form submissions across the platform.</p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-small logout-btn">
            Log Out
          </button>
        </div>

      <div className="container admin-container">
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            Loan Applications ({data.applications.length})
          </button>
          <button 
            className={`admin-tab ${activeTab === 'insurance' ? 'active' : ''}`}
            onClick={() => setActiveTab('insurance')}
          >
            Credit Insurance ({data.insurance.length})
          </button>
          <button 
            className={`admin-tab ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            Contact Messages ({data.contacts.length})
          </button>
          <button 
            className={`admin-tab ${activeTab === 'newsletters' ? 'active' : ''}`}
            onClick={() => setActiveTab('newsletters')}
          >
            Newsletter Subs ({data.newsletters.length})
          </button>

          <button 
            className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </div>

        {activeTab !== 'settings' && (
          <div className="admin-actions">
            <button onClick={downloadExcel} className="btn btn-primary">
              Download as Excel
            </button>
            <button onClick={fetchData} className="btn btn-outline">
              Refresh Data
            </button>
          </div>
        )}



        <div className="admin-content">
          {loading && activeTab !== 'settings' ? (
            <div className="admin-loading">Loading data...</div>
          ) : activeTab === 'settings' ? (
            <div className="admin-settings-page">
              {/* Security Settings */}
              <div className="admin-settings">
                <h2>🔒 Security Settings</h2>
                <p>Update the admin panel access password.</p>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const newPassword = e.target.newPassword.value;
                  if (!newPassword) return alert("Password cannot be empty");
                  
                  try {
                    const apiBase = window.location.hostname === 'localhost'
                      ? 'http://localhost:5000/api'
                      : 'https://risecredit-api.onrender.com/api';
                    const res = await fetch(`${apiBase}/settings/password`, {
                      method: 'POST',
                      headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
                      },
                      body: JSON.stringify({ newPassword })
                    });
                    const data = await res.json();
                    if (data.success) {
                      alert('Password updated successfully!');
                      e.target.reset();
                    } else {
                      alert('Error: ' + data.message);
                    }
                  } catch (err) {
                    alert('Network error failed to update password.');
                  }
                }} className="admin-settings-form">
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" name="newPassword" required placeholder="Enter new password" />
                  </div>
                  <button type="submit" className="btn btn-primary">Update Password</button>
                </form>
              </div>

              {/* Contact Numbers Management */}
              <div className="admin-settings-section">
                <AdminContactNumbers />
              </div>

              {/* Email IDs Management */}
              <div className="admin-settings-section">
                <AdminEmails />
              </div>

              {/* Banking Partners Management */}
              <div className="admin-settings-section">
                <AdminPartners />
              </div>

              {/* Addresses Management */}
              <div className="admin-settings-section">
                <AdminAddresses />
              </div>
            </div>
          ) : (
            renderTable()
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
