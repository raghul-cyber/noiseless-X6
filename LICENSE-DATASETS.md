# SIH26052 — NOISELESS-X6: Dataset Licenses, Attribution & Usage Terms

This document provides official licensing terms, citations, and compliance requirements for all research audio datasets utilized by the NOISELESS-X6 speech enhancement and acoustic telemetry engine.

---

## Summary Table

| Dataset | Primary Category | License | Commercial Use | Attribution Required | Official Source URL |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **VoiceBank-DEMAND (Clean)** | Clean Speech | CC BY 4.0 | Yes | Yes | [DataShare (Univ. of Edinburgh)](https://datashare.ed.ac.uk/handle/10283/2791) |
| **DEMAND Noise Corpus** | Environmental Noise | CC BY-SA 3.0 | Yes | Yes | [Zenodo (10.5281/zenodo.1227121)](https://doi.org/10.5281/zenodo.1227121) |
| **VCTK Corpus** | Clean Multi-Speaker Speech | ODC-By v1.0 | Yes | Yes | [DataShare (CSTR)](https://datashare.ed.ac.uk/handle/10283/3443) |
| **LibriSpeech (train-clean-100)**| Clean Speech | CC BY 4.0 | Yes | Yes | [OpenSLR 12](https://www.openslr.org/12/) |
| **MUSAN** | Music, Babble & Noise | CC0 / Public Domain | Yes | No | [OpenSLR 17](https://www.openslr.org/17/) |
| **RIRS_NOISES** | Room Impulse Responses | Apache 2.0 | Yes | Yes | [OpenSLR 28](https://www.openslr.org/28/) |
| **FSD50K** | Sound Events | CC BY 4.0 / Freesound | Mixed | Yes | [Zenodo (10.5281/zenodo.4060432)](https://zenodo.org/records/4060432) |
| **ESC-50** | Environmental Sounds | CC BY-NC 3.0 | **No (Non-Commercial)** | Yes | [GitHub (ESC-50)](https://github.com/karolpiczak/ESC-50) |
| **UrbanSound8K** | Urban Acoustic Events | CC BY-NC 3.0 | **No (Non-Commercial)** | Yes (Requires Terms Agreement) | [UrbanSound8K Official](https://urbansounddataset.weebly.com/urbansound8k.html) |
| **TAU Urban Acoustic Scenes 2020** | Acoustic Scenes | CC BY 4.0 | Yes | Yes | [Zenodo (10.5281/zenodo.3819968)](https://zenodo.org/records/3819968) |
| **Microsoft DNS Challenge 5** | Speech, Noise, RIRs | CC BY-NC 4.0 | **No (Non-Commercial)** | Yes | [GitHub (Microsoft DNS)](https://github.com/microsoft/DNS-Challenge) |

---

## Detailed Terms & Citations

### 1. VoiceBank+DEMAND (Clean Speech Subcorpus)
- **URL**: `https://datashare.ed.ac.uk/handle/10283/2791`
- **Citation**:
  ```bibtex
  @inproceedings{valentini2016investigating,
    title={Investigating RNN-based speech enhancement methods for noise-robust Text-to-Speech},
    author={Valentini-Botinhao, Cassia and Wang, Xin and Takaki, Shinji and Yamagishi, Junichi},
    booktitle={The 9th ISCA Speech Synthesis Workshop (SSW9)},
    pages={146--152},
    year={2016}
  }
  ```
- **License Terms**: Creative Commons Attribution 4.0 International (CC BY 4.0). You are free to share and adapt the material for any purpose, even commercially, under the condition of giving appropriate credit.

### 2. DEMAND Noise Corpus
- **URL**: `https://doi.org/10.5281/zenodo.1227121`
- **Citation**:
  ```bibtex
  @article{thiemann2013diverse,
    title={Diverse Environments Multi-channel Acoustic Noise Database: A database of multichannel environmental noise recordings},
    author={Thiemann, Joachim and Ito, Nobutaka and Vincent, Emmanuel},
    journal={Proceedings of Meetings on Acoustics},
    volume={19},
    number={1},
    pages={060081},
    year={2013}
  }
  ```
- **License Terms**: Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0). Allows commercial and non-commercial adaptation with attribution, distributed under the same license.

### 3. CSTR VCTK Corpus
- **URL**: `https://datashare.ed.ac.uk/handle/10283/3443`
- **Citation**:
  ```bibtex
  @misc{yamagishi2019cstr,
    title={CSTR VCTK Corpus: English Multi-speaker Speech Corpus for CSTR Voice Cloning Toolkit (version 0.92)},
    author={Yamagishi, Junichi and Veaux, Christophe and MacDonald, Kirsten},
    year={2019},
    publisher={University of Edinburgh. The Centre for Speech Technology Research (CSTR)}
  }
  ```
- **License Terms**: Open Data Commons Attribution License (ODC-By) v1.0. Attribution to the Centre for Speech Technology Research (CSTR) is required.

### 4. LibriSpeech ASR Corpus (train-clean-100)
- **URL**: `https://www.openslr.org/12/`
- **Citation**:
  ```bibtex
  @inproceedings{panayotov2015librispeech,
    title={Librispeech: an ASR corpus based on public domain audio books},
    author={Panayotov, Vassil and Chen, Guoguo and Povey, Daniel and Khudanpur, Sanjeev},
    booktitle={2015 IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP)},
    pages={5206--5210},
    year={2015}
  }
  ```
- **License Terms**: Creative Commons Attribution 4.0 International (CC BY 4.0). Audio derived from LibriVox public domain audiobooks.

### 5. MUSAN (Music, Speech, and Noise)
- **URL**: `https://www.openslr.org/17/`
- **Citation**:
  ```bibtex
  @article{snyder2015musan,
    title={MUSAN: A Music, Speech, and Noise Corpus},
    author={Snyder, David and Chen, Guoguo and Povey, Daniel},
    journal={arXiv preprint arXiv:1510.08484},
    year={2015}
  }
  ```
- **License Terms**: Creative Commons 0 (Public Domain Dedication) for dataset assembly; individual audio components sourced from Creative Commons / public domain archives.

### 6. RIRS_NOISES (Simulated and Real Room Impulse Responses)
- **URL**: `https://www.openslr.org/28/`
- **Citation**:
  ```bibtex
  @inproceedings{ko2017study,
    title={A study on data augmentation of reverberant speech for robust speech recognition},
    author={Ko, Tom and Peddinti, Vijayaditya and Povey, Daniel and Seltzer, Michael L and Khudanpur, Sanjeev},
    booktitle={2017 IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP)},
    pages={5220--5224},
    year={2017}
  }
  ```
- **License Terms**: Apache License 2.0. Free for commercial and non-commercial use with notice preservation.

### 7. FSD50K: Everyday Sound Events
- **URL**: `https://zenodo.org/records/4060432`
- **Citation**:
  ```bibtex
  @article{fonseca2022fsd50k,
    title={FSD50K: an Open Dataset of Everyday Sounds with Freesound},
    author={Fonseca, Eduardo and Favory, Xavier and Pons, Jordi and Font, Frederic and Serra, Xavier},
    journal={IEEE/ACM Transactions on Audio, Speech, and Language Processing},
    volume={30},
    pages={829--852},
    year={2022}
  }
  ```
- **License Terms**: Audio clips collected from Freesound and released under varying Creative Commons licenses (CC0, CC-BY, CC-BY-NC). Ground truth annotations released under CC BY 4.0.

### 8. ESC-50: Environmental Sound Classification
- **URL**: `https://github.com/karolpiczak/ESC-50`
- **Citation**:
  ```bibtex
  @inproceedings{piczak2015esc,
    title={ESC: Dataset for Environmental Sound Classification},
    author={Piczak, Karol J},
    booktitle={Proceedings of the 23rd ACM international conference on Multimedia},
    pages={1015--1018},
    year={2015}
  }
  ```
- **License Terms**: Creative Commons Attribution-NonCommercial 3.0 (CC BY-NC 3.0). **Non-commercial use only**.

### 9. UrbanSound8K
- **URL**: `https://urbansounddataset.weebly.com/urbansound8k.html`
- **Citation**:
  ```bibtex
  @inproceedings{salamon2014dataset,
    title={A dataset and taxonomy for urban sound research},
    author={Salamon, Justin and Jacoby, Christopher and Bello, Juan Pablo},
    booktitle={Proceedings of the 22nd ACM international conference on Multimedia},
    pages={1041--1044},
    year={2014}
  }
  ```
- **Usage Terms Notice**:
  > **MANDATORY NOTICE**: UrbanSound8K is provided strictly for academic and non-commercial research purposes under the Creative Commons Attribution-NonCommercial 3.0 Unported (CC BY-NC 3.0) license. The creators require users to complete the terms request on the official page before downloading. `ai/datasets/download_datasets.py` will not download UrbanSound8K without explicit `--accept-urbansound8k-terms` command-line affirmation.

### 10. TAU Urban Acoustic Scenes 2020
- **URL**: `https://zenodo.org/records/3819968`
- **Citation**:
  ```bibtex
  @article{mesaros2020acoustic,
    title={Acoustic scene classification in DCASE 2020 Challenge: generalizations across devices and unknown classes},
    author={Mesaros, Annamaria and Heittola, Toni and Virtanen, Tuomas},
    journal={arXiv preprint arXiv:2005.14623},
    year={2020}
  }
  ```
- **License Terms**: Creative Commons Attribution 4.0 International (CC BY 4.0).

### 11. Microsoft Deep Noise Suppression (DNS) Challenge 5
- **URL**: `https://github.com/microsoft/DNS-Challenge`
- **Citation**:
  ```bibtex
  @inproceedings{dubey2023icassp,
    title={ICASSP 2023 Deep Noise Suppression Challenge},
    author={Dubey, Harishchandra and Gopal, Vishak and Cutler, Ross and Aazami, Ashkan and Matusevych, Sergiy and Braun, Sebastian and Eskimez, Sefik Emre and Thakker, Manthan and Yoshioka, Takuya and Gamper, Hannes and others},
    booktitle={ICASSP 2023-2023 IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP)},
    pages={1--5},
    year={2023}
  }
  ```
- **License Terms**: CC BY-NC 4.0 (Non-Commercial Research Use Only). Full corpus exceeds 800 GB; subsampling script restricts acquisition to representative noise and impulse response subsets.
