import React, { useEffect, useMemo, useState } from 'react';

const endpointName = 'users';
const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const baseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000';
const endpointUrl = `${baseUrl}/api/${endpointName}/`;

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    console.log('Fetching endpoint:', endpointUrl);
    try {
      const response = await fetch(endpointUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpointName}: ${response.status}`);
      }
      const rawData = await response.json();
      console.log('Users raw data:', rawData);
      const results = Array.isArray(rawData) ? rawData : rawData?.results ?? [];
      setUsers(results);
      setError(null);
    } catch (fetchError) {
      console.error('Users fetch error:', fetchError);
      setError(fetchError.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const normalized = search.toLowerCase();
    return users.filter((item) => JSON.stringify(item).toLowerCase().includes(normalized));
  }, [users, search]);

  const headers = useMemo(() => {
    if (!filteredUsers.length) return ['Data'];
    const first = filteredUsers[0];
    return first && typeof first === 'object' && !Array.isArray(first)
      ? Object.keys(first)
      : ['Value'];
  }, [filteredUsers]);

  const renderCell = (item, key) => {
    if (typeof item !== 'object' || item === null) {
      return <td>{String(item)}</td>;
    }
    const value = item[key];
    if (typeof value === 'object' && value !== null) {
      return <td><pre className="mb-0 pre-json">{JSON.stringify(value, null, 1)}</pre></td>;
    }
    return <td>{String(value ?? '')}</td>;
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 className="card-title">Users</h2>
            <p className="text-muted endpoint-badge">Endpoint: <code>{endpointUrl}</code></p>
          </div>
          <button className="btn btn-outline-primary" onClick={fetchUsers} disabled={loading}>
            Refresh
          </button>
        </div>

        <form className="row g-3 align-items-center mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-auto">
            <label htmlFor="userSearch" className="col-form-label">Search</label>
          </div>
          <div className="col-auto flex-grow-1">
            <input
              id="userSearch"
              className="form-control"
              placeholder="Search users"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="col-auto">
            <button type="button" className="btn btn-secondary" onClick={() => setSearch('')}>
              Clear
            </button>
          </div>
        </form>

        {loading && <div className="alert alert-info">Loading users...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="table-container">
            {filteredUsers.length > 0 ? (
              <table className="table table-striped table-hover table-bordered align-middle">
                <thead className="table-dark">
                  <tr>
                    {headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((item, index) => (
                    <tr key={index}>
                      {headers.map((header) => renderCell(item, header))}
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedItem(item)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="alert alert-warning">No users found.</div>
            )}
          </div>
        )}

        {selectedItem && (
          <>
            <div className="modal-backdrop-custom" onClick={() => setSelectedItem(null)} />
            <div className="modal fade show d-block" tabIndex="-1" role="dialog">
              <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">User Details</h5>
                    <button type="button" className="btn-close" onClick={() => setSelectedItem(null)} />
                  </div>
                  <div className="modal-body">
                    <pre className="pre-json">{JSON.stringify(selectedItem, null, 2)}</pre>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedItem(null)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Users;
