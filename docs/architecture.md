# SIH26052 — NOISELESS-X6: Architecture Documentation (Raspberry Pi 4/5)

## 1. Executive Summary

**NOISELESS-X6** is an embedded, real-time dual-microphone speech enhancement and adaptive noise cancellation system designed specifically for the **Raspberry Pi 4 / 5** (64-bit Raspberry Pi OS / Debian 12).

Originally designed for an NVIDIA Jetson platform with CUDA and TensorRT, this architecture has been adapted to leverage the ARM64 CPU with ARM NEON SIMD extensions using **ONNX Runtime (CPU EP)** and optimized integer inference.

---

## 2. Hardware Topology & Microphone Roles

The physical audio pipeline uses two dedicated hardware input microphones and one playback output connected via ALSA:

```
                        +-------------------------------------------------+
                        |                 Acoustic Field                  |
                        +-------------------------------------------------+
                                /                                   \
                 Speech + Ambient Noise                     Acoustic Noise / Residual
                               /                                       \
                              v                                         v
             +-----------------------------------+     +-----------------------------------+
             |            PRIMARY MIC            |     |           REFERENCE MIC           |
             |      (Headphone / Headset Mic)    |     |            (Error Mic)            |
             +-----------------------------------+     +-----------------------------------+
                              |                                         |
                              v                                         v
                       ALSA Capture                              ALSA Capture
                    (Primary Audio Stream)                   (Reference Noise Stream)
                              \                                         /
                               \                                       /
                                v                                     v
                         +-------------------------------------------------+
                         |            Dual-Microphone NLMS Block           |
                         +-------------------------------------------------+
```

### Microphone Roles:
1. **PRIMARY Microphone (`input_device`)**:
   - Physical device: Headphone / headset microphone.
   - Purpose: Captures desired near-field speech combined with ambient environmental noise.
2. **REFERENCE Microphone (`reference_device` / "Error Mic")**:
   - Physical device: Secondary acoustic sensor (ambient / residual reference).
   - Purpose: Captures the ambient noise field and acoustic feedback, acting as the reference and error signal path for the adaptive filter.

> [!NOTE]
> In this design, **"error mic"** refers exclusively to the physical secondary reference microphone hardware. It is completely unrelated to `errors.log` (system diagnostic logging).

---

## 3. Adaptations from Jetson to Raspberry Pi

| Subsystem | Jetson Architecture | Raspberry Pi Architecture | Rationale |
| :--- | :--- | :--- | :--- |
| **OS** | Jetpack (Ubuntu 20.04/22.04) | Raspberry Pi OS 64-bit (Debian 12) | Standard supported Linux on Pi 4/5 |
| **AI Inference** | TensorRT Engine (`.engine`) | ONNX Runtime C++ API (CPU EP + ARM NEON) | Pi lacks discrete CUDA GPU; ORT INT8 runs with low latency on ARM NEON |
| **Quantization** | TensorRT FP16 / INT8 calibrator | Dynamic / Static INT8 ONNX Quantization | Optimized for ARM NEON integer dot-product SIMD |
| **Diagnostics** | CUDA / GPU memory & utilization | System CPU %, per-core load, SoC temp (`vcgencmd`) | Native thermal and compute profiling on Broadcom SoC |
| **Config File** | `config/jetson.yaml` | `config/raspberrypi.yaml` | Device nodes, CPU thread bindings, buffer sizes |
| **NLMS Mode** | Single-mic fallback initially | Dual-mic NLMS active by default | Hardware already features two physical microphones |

---

## 4. Signal Processing & Inference Pipeline

The audio loop operates at 16 kHz sample rate with a 10 ms frame size (160 samples) and 5 ms hop size (80 samples) to ensure an end-to-end latency budget $\le 15$ ms:

```
  +----------------------------------------------------------------------------------------+
  |                                   Audio Processing Loop                                |
  +----------------------------------------------------------------------------------------+
       |
       +--> ALSA Capture: Primary Frame x[n] & Reference Frame d[n]
       |
       +--> Pre-emphasis & Framing (Hanning Window)
       |
       +--> Dual-Channel STFT (Short-Time Fourier Transform) -> Magnitude & Phase
       |
       +--> Time-Domain Dual-Mic NLMS Adaptive Filter:
       |      - Subtraction of correlated ambient noise using reference mic
       |      - Generates filtered primary speech signal e[n]
       |
       +--> Impulse Noise Detector:
       |      - Computes energy ratio & spectral kurtosis
       |      - Triggers soft-clipping / attenuation mask on sudden transients
       |
       +--> AI Speech Enhancement (ONNX Runtime CPU EP + ARM NEON):
       |      - Input: Primary STFT magnitude features
       |      - Output: Spectral mask / enhanced magnitude spectrum
       |
       +--> Spectral Fusion:
       |      - Fuses NLMS output + AI spectral mask based on SNR & impulse flags
       |      - S_fused(f) = alpha * S_ai(f) + (1 - alpha) * S_nlms(f)
       |
       +--> iSTFT (Inverse STFT) & Overlap-Add Reconstruction
       |
       +--> ALSA Playback Output: Enhanced Audio to Headset
```

---

## 5. Non-Negotiable Rules & Hardware Discipline

1. **Zero Mocks Policy**:
   - Under no circumstances will production code or hardware validation test suites use `fake_audio()`, `random_noise()`, or synthetic CPU utilization.
   - The embedded runtime checks ALSA device handles on initialization. If the Primary or Reference mic is disconnected, the engine raises an explicit hardware error and refuses to transition to an unsafe state.
2. **Phase-by-Phase Verification**:
   - Each phase is verified on actual hardware using designated hardware verification scripts/tests before progressing.
3. **Thermal & Latency Monitoring**:
   - Real-time diagnostic loop queries `vcgencmd measure_temp` and per-core `/proc/stat` to prevent thermal throttling ($< 80^\circ\text{C}$).
