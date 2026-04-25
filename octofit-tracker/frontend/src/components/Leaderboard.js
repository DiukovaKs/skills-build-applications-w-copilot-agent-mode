import React, { useEffect, useMemo, useState } from 'react';

const endpointName = 'leaderboard';
const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const baseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000';
const endpointUrl = `${baseUrl}/api/${endpointName}/`;

function Leaderboard() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    console.log('Fetching endpoint:', endpointUrl);
    try {
      const response = await fetch(endpointUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpointName}: ${response.status}`);
      }
      const rawData = await response.json();
      console.log('Leaderboard raw data:', rawData);
      const results = Array.isArray(rawData) ? rawData : rawData?.results ?? [];
      setItems(results);
      setError(null);
    } catch (fetchError) {
      console.error('Leaderboard fetch error:', fetchError);
      setError(fetchError.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const filteredItems = useMemo(() => {
    if (!search) return items;
    const normalized = search.toLowerCase();
    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(normalized));
  }, [items, search]);

  const headers = useMemo(() => {
    if (!filteredItems.length) return ['Data'];
    const first = filteredItems[0];
    return first && typeof first === 'object' && !Array.isArray(first)
      ? Object.keys(first)
      : ['Value'];
  }, [filteredItems]);

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
            <h2 className="card-title">Leaderboard</h2>
            <p className="text-muted endpoint-badge">Endpoint: <code>{endpointUrl}</code></p>
          </div>
          <button className="btn btn-outline-primary" onClick={fetchLeaderboard} disabled={loading}>
            Refresh
          </button>
        </div>

        <form className="row g-3 align-items-center mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-auto">
            <label htmlFor="leaderboardSearch" className="col-form-label">Search</label>
          </div>
          <div className="col-auto flex-grow-1">
            <input
              id="leaderboardSearch"
              className="form-control"
              placeholder="Search leaderboard"
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

        {loading && <div className="alert alert-info">Loading leaderboard...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="table-container">
            {filteredItems.length > 0 ? (
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
                  {filteredItems.map((item, index) => (
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
              <div className="alert alert-warning">No leaderboard entries found.</div>
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
                    <h5 className="modal-title">Leaderboard Entry Details</h5>
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

export default Leaderboard;
