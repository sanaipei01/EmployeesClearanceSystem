import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from './DashboardLayout';
import StatCard from './StatCard';
import AdminDayOverview from './AdminDayOverview';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const APPROVAL_STEPS = ['Manager', 'HR', 'Admin', 'Done'];

function ApprovalTracker({ currentLevel, status }) {
  const stepIndex =
    status === 'rejected'
      ? -1
      : status === 'approved'
      ? 3
      : APPROVAL_STEPS.indexOf(
          currentLevel
            ? currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)
            : 'Manager'
        );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
      {APPROVAL_STEPS.map((step, i) => {
        const isActive = i === stepIndex;
        const isCompleted = i < stepIndex;
        return (
          <div
            key={step}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: isActive || isCompleted ? '#0f172a' : '#94a3b8',
              fontWeight: isActive ? 700 : 500,
              fontSize: 12,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isCompleted ? '#22c55e' : isActive ? '#7c3aed' : '#e2e8f0',
                color: isCompleted || isActive ? '#fff' : '#64748b',
                fontSize: 11,
              }}
            >
              {isCompleted ? '✓' : i + 1}
            </span>
            <span>{step}</span>
          </div>
        );
      })}
    </div>
  );
}

function UrgencyBadge({ urgency }) {
  const map = {
    urgent: { bg: '#fee2e2', color: '#dc2626', label: 'Urgent' },
    high: { bg: '#ffedd5', color: '#ea580c', label: 'High' },
    normal: { bg: '#dbeafe', color: '#2563eb', label: 'Normal' },
    low: { bg: '#f0fdf4', color: '#16a34a', label: 'Low' },
  };
  const style = map[urgency] || map.normal;
  return (
    <span
      style={{
        padding: '2px 10px',
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 700,
        background: style.bg,
        color: style.color,
      }}
    >
      {style.label}
    </span>
  );
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
    totalEmployees: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [activeTab, setActiveTab] = useState('pending');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const token = localStorage.getItem('ecs_token');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [requestsRes, employeesRes] = await Promise.all([
        fetch(`${API_BASE}/api/requests`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }),
        fetch(`${API_BASE}/api/employees`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }),
      ]);

      if (!requestsRes.ok) {
        const err = await requestsRes.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to load requests');
      }

      if (!employeesRes.ok) {
        const err = await employeesRes.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to load employees');
      }

      const requestsData = await requestsRes.json();
      const employeesData = await employeesRes.json();
      const requestList = Array.isArray(requestsData)
        ? requestsData
        : requestsData.requests || [];
      const employeeList = Array.isArray(employeesData)
        ? employeesData
        : employeesData.employees || [];

      setRequests(requestList);
      setEmployees(employeeList);
      setStats({
        pending: requestList.filter((req) => req.status === 'pending').length,
        approved: requestList.filter((req) => req.status === 'approved').length,
        rejected: requestList.filter((req) => req.status === 'rejected').length,
        total: requestList.length,
        totalEmployees: employeeList.length,
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const handleAction = async (requestId, action) => {
    setActionLoading((prev) => ({ ...prev, [requestId]: true }));
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to ${action} request`);
      }

      await fetchAll();
    } catch (err) {
      setError(err.message || `Unable to ${action} request`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const myQueue = requests.filter(
    (r) => r.approval_level === 'admin' && r.status === 'pending'
  );

  const requestTypes = ['all', ...new Set(
    requests
      .map((r) => r.type || r.request_type)
      .filter(Boolean)
  )];

  const applyFilters = (list) => {
    let result = list;

    if (filterType !== 'all') {
      result = result.filter(
        (req) => (req.type || req.request_type) === filterType
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter((req) => req.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((req) => {
        const name =
          req.employee_name ||
          (req.employee && req.employee.name) ||
          '';
        const id = req.employee_id || req.id || '';
        const type = req.type || req.request_type || '';
        return (
          name.toLowerCase().includes(query) ||
          String(id).toLowerCase().includes(query) ||
          type.toLowerCase().includes(query)
        );
      });
    }

    return result;
  };

  const tabItems =
    activeTab === 'pending' ? applyFilters(myQueue) : applyFilters(requests);

  return (
    <DashboardLayout>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Admin Dashboard
          </h1>
          {lastUpdated && (
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>
              Last updated: {lastUpdated.toLocaleTimeString()} · Auto-refreshes every 15s
            </p>
          )}
        </div>
        <button
          onClick={fetchAll}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: '#7c3aed',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div
          style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 16,
            color: '#dc2626',
            fontSize: 14,
          }}
        >
          ⚠ {error}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5,1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatCard label="Admin Queue" value={stats.pending} color="#7c3aed" />
        <StatCard label="Approved" value={stats.approved} color="#059669" />
        <StatCard label="Rejected" value={stats.rejected} color="#dc2626" />
        <StatCard label="Total Requests" value={stats.total} color="#2563eb" />
        <StatCard label="Employees" value={stats.totalEmployees} color="#0891b2" />
      </div>

      <AdminDayOverview requests={requests} employees={employees} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 24,
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { key: 'pending', label: `My Admin Queue (${myQueue.length})` },
            { key: 'all', label: `All Requests (${requests.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '8px 18px',
                borderRadius: 20,
                border: 'none',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                background: activeTab === tab.key ? '#7c3aed' : '#f1f5f9',
                color: activeTab === tab.key ? '#fff' : '#64748b',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by name, ID, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 13,
              color: '#475569',
              width: 220,
              outline: 'none',
            }}
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 13,
              color: '#475569',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            {requestTypes.map((t) => (
              <option key={t} value={t}>
                {t === 'all' ? 'All Types' : t}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 13,
              color: '#475569',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            {['all', 'pending', 'approved', 'rejected'].map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
          Loading all requests...
        </div>
      ) : tabItems.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 60,
            color: '#94a3b8',
            background: '#f8fafc',
            borderRadius: 12,
            border: '2px dashed #e2e8f0',
          }}
        >
          {activeTab === 'pending'
            ? '🎉 No pending requests in Admin queue'
            : 'No requests match your filters'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tabItems.map((req) => {
            const isMyTurn =
              req.approval_level === 'admin' && req.status === 'pending';
            const isLoading = actionLoading[req.id];
            return (
              <div
                key={req.id}
                style={{
                  padding: 18,
                  borderRadius: 16,
                  background: '#fff',
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: 6,
                      }}
                    >
                      {req.employee_name ||
                        (req.employee && req.employee.name) ||
                        `Request #${req.id}`}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 8,
                        color: '#64748b',
                        fontSize: 13,
                      }}
                    >
                      <span>{req.type || req.request_type || 'Request'}</span>
                      <span>
                        {req.status?.charAt(0).toUpperCase() + req.status?.slice(1)}
                      </span>
                      <span>
                        {req.approval_level
                          ? req.approval_level.charAt(0).toUpperCase() +
                            req.approval_level.slice(1)
                          : 'Manager'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <UrgencyBadge urgency={req.urgency || req.priority || 'normal'} />
                    {isMyTurn && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAction(req.id, 'reject')}
                          disabled={isLoading}
                          style={{
                            padding: '8px 14px',
                            borderRadius: 10,
                            border: '1px solid #f87171',
                            background: '#fff',
                            color: '#b91c1c',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          {isLoading ? 'Working…' : 'Reject'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(req.id, 'approve')}
                          disabled={isLoading}
                          style={{
                            padding: '8px 14px',
                            borderRadius: 10,
                            border: 'none',
                            background: '#22c55e',
                            color: '#fff',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          {isLoading ? 'Working…' : 'Approve'}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <ApprovalTracker
                    currentLevel={req.approval_level}
                    status={req.status}
                  />
                </div>

                {(req.notes || req.review_notes) && (
                  <p
                    style={{
                      marginTop: 14,
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: '#475569',
                    }}
                  >
                    {req.notes || req.review_notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
