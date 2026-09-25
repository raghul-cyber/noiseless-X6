import React from 'react';
import { Activity, Cpu, Settings, Wifi, WifiOff } from 'lucide-react';
import type { HealthResponse, ModelResponse } from '../types/telemetry';

interface HeaderProps {
  health: HealthResponse | null;
  model: ModelResponse | null;
  isWsConnected: boolean;
  runtimeConnected: boolean;
  runtimeState: string;
  onOpenDevices: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  model,
  isWsConnected,
  runtimeConnected,
  runtimeState,
  onOpenDevices,
}) => {
  const getStatusPillClass = () => {
    if (!runtimeConnected) return 'status-degraded';
    if (runtimeState.toLowerCase() === 'running') return 'status-running';
    if (runtimeState.toLowerCase() === 'bypass') return 'status-bypass';
    return 'status-ready';
  };

  const getStatusText = () => {
    if (!runtimeConnected) return 'RUNTIME OFFLINE';
    return runtimeState.toUpperCase();
  };

  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Brand & Subsystem Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(139, 92, 246, 0.3))',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.25)',
          }}>
            <Activity size={22} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                NOISELESS-X6
              </h1>
              <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                SIH26052
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Dual-Microphone Real-Time Speech Enhancement & Telemetry
            </p>
          </div>
        </div>

        {/* Model & Runtime Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Active Model Tag */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: '#c4b5fd',
          }}>
            <Cpu size={14} color="#a78bfa" />
            <span>{model?.model_name || 'ComplexCRN'}</span>
            <span style={{ opacity: 0.6 }}>|</span>
            <span style={{ color: 'var(--accent-cyan)' }}>{model?.quantization ? 'INT8 NEON' : 'N/A'}</span>
            {health && <span style={{ opacity: 0.5 }}>({health.backend})</span>}
          </div>

          {/* WebSocket Link Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            borderRadius: 'var(--radius-md)',
            background: isWsConnected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${isWsConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: isWsConnected ? '#34d399' : '#f87171',
          }}>
            {isWsConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
            <span>{isWsConnected ? '20 Hz LIVE' : 'WS OFFLINE'}</span>
          </div>

          {/* Runtime State Badge */}
          <div className={`status-pill ${getStatusPillClass()}`}>
            <span className="status-dot" />
            <span>{getStatusText()}</span>
          </div>

          {/* Device Config Modal Button */}
          <button
            onClick={onOpenDevices}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Configure ALSA Audio & Hardware Devices"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
