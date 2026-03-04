import React from 'react';

export default function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{
      background: '#111827',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '22px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '24px' }}>{icon}</span>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: color, boxShadow: `0 0 8px ${color}`,
        }} />
      </div>
      <div>
        <div style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'Syne, sans-serif', color: '#F9FAFB', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>{label}</div>
        {sub && <div style={{ fontSize: '11px', color: color, marginTop: '4px' }}>{sub}</div>}
      </div>
    </div>
  );
}