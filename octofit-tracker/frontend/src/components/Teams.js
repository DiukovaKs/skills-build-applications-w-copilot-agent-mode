import React, { useEffect, useMemo, useState } from 'react';

const endpointName = 'teams';
const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const baseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000';
const endpointUrl = `${baseUrl}/api/${endpointName}/`;

function Teams() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    console.log('Fetching endpoint:', endpointUrl);
    try {
      const response = await fetch(endpointUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpointName}: ${response.status}`);
      }
      const rawData = await response.json();
      console.log('Teams raw data:', rawData);
      const results = Array.isArray(rawData) ? rawData : rawData?.results ?? [];
      setTeams(results);
      setError(null);
    } catch (fetchError) {
      console.error('Teams fetch error:', fetchError);
      setError(fetchError.message);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    if (!search) return teams;
    const normalized = search.toLowerCase();
    return teams.filter((item) => JSON.stringify(item).toLowerCase().includes(normalized));
  }, [teams, search]);

  const headers = useMemo(() => {
    if (!filteredTeams.length) return ['Data'];
    const first = filteredTeams[0];
    return first && typeof first === 'object' && !Array.isArray(first)
      ? Object.keys(first)
      : ['Value'];
  }, [filteredTeams]);

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
            <h2 className="card-title">Teams</h2>
            <p className="text-muted endpoint-badge">Endpoint: <code>{endpointUrl}</code></p>
          </div>
          <button className="btn btn-outline-primary" onClick={fetchTeams} disabled={loading}>
            Refresh
          </button>
        </div>

        <form className="row g-3 align-items-center mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-auto">
            <label htmlFor="teamSearch" className="col-form-label">Search</label>
          </div>
          <div className="col-auto flex-grow-1">
            <input
              id="teamSearch"
              className="form-control"
              placeholder="Search teams"
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

        {loading && <div className="alert alert-info">Loading teams...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="table-container">
            {filteredTeams.length > 0 ? (
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
                  {filteredTeams.map((item, index) => (
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
              <div className="alert alert-warning">No teams found.</div>
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
                    <h5 className="modal-title">Team Details</h5>
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

export default Teams;
