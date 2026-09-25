# NOISELESS-X6 — Research Dataset Catalog & Provenance Guide

**Project**: SIH26052 NOISELESS-X6 — Active Noise Cancellation & Real-Time Speech Enhancement  
**Policy**: **Strict Zero-Mock / Zero Arbitrary Web-Scraping Policy**. All speech, noise, and acoustic impulse responses originate from citable, established speech-enhancement research corpora with fully traceable licensing and provenance.

---

## 1. Verified Research Datasets

Arbitrary web-scraped audio compromises model generalization, lacks verified SNR references, introduces unknown licensing liabilities, and violates academic reproducibility standards. NOISELESS-X6 uses only datasets with explicit provenance and documented release terms.

### 1.1 Clean Speech ($s[n]$ in Mixing Equation)

| Dataset | Size | Verified Official Source | Citation / Notes | License |
| :--- | :--- | :--- | :--- | :--- |
| **VoiceBank** | 11,572 train / 824 test utterances (28+2 speakers) | [https://datashare.ed.ac.uk/handle/10283/2791](https://datashare.ed.ac.uk/handle/10283/2791) | *Valentini-Botinhao et al., SSWC 2016.* | Permissive academic use |
| **VCTK full corpus** | ~44 hours, 110 native speakers | [https://datashare.ed.ac.uk/handle/10283/3443](https://datashare.ed.ac.uk/handle/10283/3443) | *Yamagishi et al., CSTR 2019.* Diverse accent coverage | Academic use |
| **LibriSpeech** | 100–460 hours (`train-clean-100` / `train-clean-360`) | [https://www.openslr.org/12](https://www.openslr.org/12) | *Panayotov et al., ICASSP 2015.* Standard large-scale corpus | CC BY 4.0 |
| **Microsoft DNS Challenge 5 — clean_fullband** | up to 827 GB (targeted subsample) | [https://github.com/microsoft/DNS-Challenge](https://github.com/microsoft/DNS-Challenge) | *Dubey et al., ICASSP 2023.* | Research-use license |

---

### 1.2 Acoustic Noise ($v[n]$ in Mixing Equation)

| Dataset | Size | Verified Official Source | Citation / Notes | License |
| :--- | :--- | :--- | :--- | :--- |
| **DEMAND** | 18 real-world noise environments (16-channel array) | [https://doi.org/10.5281/zenodo.1227121](https://doi.org/10.5281/zenodo.1227121) | *Thiemann et al., POMA 2013.* Paired with VoiceBank/VCTK | Open access |
| **MUSAN** | ~109 hours (Music, Speech Babble, Technical Noise) | [https://www.openslr.org/17](https://www.openslr.org/17) | *Snyder et al., arXiv:1510.08484, 2015.* | OpenSLR release |
| **DNS Challenge 5 — noise_fullband** | 58 GB | [https://github.com/microsoft/DNS-Challenge](https://github.com/microsoft/DNS-Challenge) | *Dubey et al., ICASSP 2023.* Massive diversity of real-world noise | Research-use license |
| **FSD50K** | 51,197 clips, 200 sound-event classes | [https://zenodo.org/records/4060432](https://zenodo.org/records/4060432) | *Fonseca et al., IEEE/ACM TASLP 2022.* AudioSet ontology sound events | CC BY 4.0 |
| **ESC-50** | 2,000 clips, 50 environmental classes | [https://github.com/karolpiczak/ESC-50](https://github.com/karolpiczak/ESC-50) | *Piczak, ACM MM 2015.* Cleanly labeled 5-second recordings | CC BY-NC 3.0 |
| **UrbanSound8K** | 8,732 clips, 10 urban classes | [https://urbansounddataset.weebly.com/urbansound8k.html](https://urbansounddataset.weebly.com/urbansound8k.html) | *Salamon et al., ACM MM 2014.* | Academic use |
| **TAU Urban Acoustic Scenes 2020** | 10 acoustic scenes, ~40 hours | [https://zenodo.org/records/3819968](https://zenodo.org/records/3819968) | *Mesaros et al., DCASE 2020.* Acoustic recordings | DCASE terms |

---

### 1.3 Room Impulse Responses ($h_s, h_v$ Convolution Terms)

| Dataset | Size | Verified Official Source | Citation / Notes | License |
| :--- | :--- | :--- | :--- | :--- |
| **RIRS_NOISES (OpenSLR 28)** | Simulated + real RIRs | [https://www.openslr.org/28](https://www.openslr.org/28) | *Ko et al., ICASSP 2017.* Simulated and real room impulse responses with varying acoustic conditions | OpenSLR |
| **DNS Challenge 5 — impulse_responses** | 5.9 GB | [https://github.com/microsoft/DNS-Challenge](https://github.com/microsoft/DNS-Challenge) | *Dubey et al., ICASSP 2023.* Real and synthesized room acoustics | Research-use license |

---

## 2. Dataset Acquisition CLI (`ai/datasets/download_datasets.py`)

The downloader validates URLs, performs resumable chunked downloads with HTTP Range headers, validates SHA-256 checksums, and unpacks archives into `data/raw/`:

```bash
# 1. View catalog with verified sources, sizes, licenses, and notes
python ai/datasets/download_datasets.py --list

# 2. Download specific official research datasets
python ai/datasets/download_datasets.py --dataset voicebank_clean
python ai/datasets/download_datasets.py --dataset demand_noise
python ai/datasets/download_datasets.py --dataset rirs_noises
python ai/datasets/download_datasets.py --dataset esc50

# 3. Download UrbanSound8K with verified terms agreement
python ai/datasets/download_datasets.py --dataset urbansound8k --accept-urbansound8k-terms

# 4. Download targeted DNS Challenge 5 subsets
python ai/datasets/download_datasets.py --dataset dns5_clean --dns5-subsample-gb 10.0
python ai/datasets/download_datasets.py --dataset dns5_noise --dns5-subsample-gb 5.0
python ai/datasets/download_datasets.py --dataset dns5_rir

# 5. Dry-run URL verification without downloading
python ai/datasets/download_datasets.py --dataset librispeech --dry-run
```

---

## 3. Audio Verification & Manifest Generation (`ai/datasets/prepare_manifest.py`)

Every audio file is actively decoded to ensure 0% file corruption, resampled to 16 kHz mono, classified into the acoustic ontology, and indexed into `data/manifests/manifest.csv`:

```bash
python ai/datasets/prepare_manifest.py \
    --input-dir data/raw \
    --output-manifest data/manifests/manifest.csv \
    --summary-json data/manifests/manifest_summary.json \
    --target-sr 16000 \
    --val-ratio 0.1 \
    --test-ratio 0.1
```

### Strict Disjointness Guarantee
- **Speaker Disjointness**: Train, validation, and test splits contain 0% overlapping speaker IDs (e.g. `p225` and `p226` in train, `p287` in test).
- **Noise Recording Disjointness**: Continuous background recordings (e.g. `DKITCHEN`, `TBUS`) are partitioned by file source so test evaluation is never tested on recordings seen during training.

---

## 4. Acoustic Mixing Equation (`ai/preprocessing/mixer.py`)

The DataLoader dynamically synthesizes realistic mixtures using real audio components according to the physical mixing equation:

$$x[n] = (s * h_s)[n] + \alpha(n) \cdot (v * h_v)[n] + i[n] + \eta[n]$$

Where:
- $s[n]$: Clean speech utterance from **VoiceBank**, **VCTK**, **LibriSpeech**, or **DNS-5 Clean**.
- $v[n]$: Environmental background noise from **DEMAND**, **MUSAN**, **DNS-5 Noise**, **UrbanSound8K**, or **TAU 2020**.
- $h_s, h_v$: Real room impulse response from **RIRS_NOISES** or **DNS-5 RIRs** (applied with 40% probability).
- $\alpha(n)$: RMS-calibrated gain matching randomly sampled target SNR $\in [-5.0\text{ dB}, +15.0\text{ dB}]$:
  $$\alpha = \sqrt{\frac{\sum s^2}{\sum v^2} \cdot 10^{-\text{SNR}_{\text{target}} / 10}}$$
- $i[n]$: Transient acoustic impulse (e.g. door slam, glass break, gunshot) from **ESC-50** or **FSD50K** (applied with 25% probability).
- $\eta[n]$: Hardware sensor noise floor calibrated at $-60\text{ dBFS}$.
