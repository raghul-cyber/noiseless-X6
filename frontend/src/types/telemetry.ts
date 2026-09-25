/**
 * Telemetry and System Models for NOISELESS-X6 Operator Dashboard.
 * Maps 1:1 with backend Pydantic schemas.
 */

export interface HealthResponse {
  status: 'healthy' | 'degraded';
  backend: string;
  runtime_connected: boolean;
  runtime_error?: string | null;
  runtime_state?: 'ready' | 'running' | 'stopped' | 'offline' | string | null;
  timestamp: number;
}

export interface CpuMetrics {
  overall_pct: number;
  cores_pct: number[];
}

export interface MemoryMetrics {
  total_mb: number;
  used_mb: number;
  free_mb: number;
}

export interface SystemResponse {
  cpu: CpuMetrics;
  temperature_c: number;
  temperature_available: boolean;
  memory: MemoryMetrics;
  source: string;
  timestamp: number;
}

export interface AudioDeviceItem {
  card_index: number;
  device_index: number;
  device_type: string;
  identifier: string;
  name: string;
}

export interface AudioConfigInfo {
  sample_rate: number;
  channels: number;
  frame_ms: number;
  hop_ms: number;
  primary_device: string;
  reference_device: string;
  output_device: string;
  period_size: number;
  buffer_size: number;
}

export interface AudioDevicesResponse {
  config: AudioConfigInfo;
  devices: AudioDeviceItem[];
}

export interface ModelResponse {
  model_path: string;
  model_name: string;
  quantization: string;
  execution_provider: string;
  intra_op_threads: number;
  input_shape: string[];
  output_shape: string[];
}

export interface StageLatencies {
  capture_us: number;
  preprocessing_us: number;
  stft_us: number;
  ai_inference_us: number;
  istft_us: number;
  nlms_us: number;
  fusion_us: number;
  playback_queue_us: number;
  total_processing_us: number;
  end_to_end_latency_ms: number;
}

export interface MetricsResponse {
  latencies: StageLatencies;
  rtf: number;
  processed_frames: number;
  dropped_frames: number;
  alsa_xruns: {
    primary: number;
    reference: number;
    playback: number;
  };
  drift_ms: number;
  drift_samples: number;
  drift_warning: boolean;
  fusion_mode: 'NORMAL' | 'LOW_CONFIDENCE' | 'IMPULSE' | 'DEGRADED' | 'NLMS_FAULT' | 'BYPASS' | 'ERROR' | string;
  current_lambda: number;
  impulse_envelope_gain: number;
  ai_confidence: number;
  impulse_probability: number;
  vad_probability: number;
  input_snr_db?: number | null;
  output_snr_db?: number | null;
  estimated_input_snr_db?: number | null;
  estimated_output_snr_db?: number | null;
  estimated_snr_improvement_db?: number | null;
  snr_is_estimated?: boolean;
  primary_level_dbfs?: number | null;
  reference_level_dbfs?: number | null;
  output_level_dbfs?: number | null;
  timestamp: number;
}

export interface RuntimeCommandResponse {
  status: 'ok' | 'error';
  command: string;
  message: string;
  runtime_state?: string | null;
}

export interface WebSocketTelemetryPayload {
  type: 'telemetry' | 'telemetry_warning' | 'telemetry_offline' | 'pong';
  status: 'connected' | 'runtime_error' | 'disconnected';
  data?: MetricsResponse;
  error?: string;
  message?: string;
  timestamp: number;
}
