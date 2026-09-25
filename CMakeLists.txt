cmake_minimum_required(VERSION 3.20)
project(SIH26052_NOISELESS_X6
    VERSION 0.1.0
    DESCRIPTION "Real-time dual-microphone speech enhancement and adaptive noise cancellation for Raspberry Pi"
    LANGUAGES C CXX
)

# Standard C++20 requirement
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Platform & Architecture Tuning (Target: Raspberry Pi 4/5 ARM64)
if(CMAKE_SYSTEM_PROCESSOR MATCHES "aarch64|arm64")
    message(STATUS "Detected target architecture: ARM64 (Raspberry Pi 4/5)")
    if(CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
        add_compile_options(-march=armv8-a+simd -O3 -fPIC)
    endif()
else()
    message(STATUS "Host architecture: ${CMAKE_SYSTEM_PROCESSOR} (Development / Host mode)")
endif()

# Common compilation flags
if(CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
    add_compile_options(-Wall -Wextra -Wpedantic)
elseif(MSVC)
    add_compile_options(/W4 /EHsc /utf-8)
endif()

# Configuration Options
# Enable/disable ALSA (defaults ON on Linux, OFF on Windows/macOS)
if(CMAKE_SYSTEM_NAME STREQUAL "Linux")
    option(ENABLE_ALSA "Enable ALSA audio capture and playback backend" ON)
else()
    option(ENABLE_ALSA "Enable ALSA audio capture and playback backend" OFF)
endif()

# Enable/disable ONNX Runtime C++ API
option(ENABLE_ONNXRUNTIME "Enable ONNX Runtime CPU EP inference engine" ON)

# Enable/disable Test Suite
option(BUILD_TESTS "Build GoogleTest test suite" ON)

# Hardware Detection / ALSA Configuration
if(ENABLE_ALSA)
    find_package(ALSA)
    if(ALSA_FOUND)
        message(STATUS "ALSA found: ${ALSA_VERSION_STRING} (Library: ${ALSA_LIBRARIES})")
        add_compile_definitions(NOISELESSX_HAS_ALSA=1)
    else()
        message(WARNING "ALSA not found! Audio backend disabled. (Note: Runtime on Raspberry Pi requires real ALSA hardware and refuses READY without it.)")
        set(ENABLE_ALSA OFF)
        add_compile_definitions(NOISELESSX_HAS_ALSA=0)
    endif()
else()
    message(STATUS "ALSA backend disabled by configuration (Dev / Host mode).")
    add_compile_definitions(NOISELESSX_HAS_ALSA=0)
endif()

# ONNX Runtime Configuration
if(ENABLE_ONNXRUNTIME)
    find_path(ONNXRUNTIME_INCLUDE_DIR NAMES onnxruntime_cxx_api.h
        PATHS
        /usr/include/onnxruntime
        /usr/local/include/onnxruntime
        $ENV{ONNXRUNTIME_ROOT}/include
    )
    find_library(ONNXRUNTIME_LIB NAMES onnxruntime
        PATHS
        /usr/lib
        /usr/local/lib
        $ENV{ONNXRUNTIME_ROOT}/lib
    )

    if(ONNXRUNTIME_INCLUDE_DIR AND ONNXRUNTIME_LIB)
        message(STATUS "ONNX Runtime found: ${ONNXRUNTIME_LIB}")
        add_compile_definitions(NOISELESSX_HAS_ONNXRUNTIME=1)
    else()
        message(STATUS "ONNX Runtime not found in system paths. Header/interface mode enabled for dev host.")
        add_compile_definitions(NOISELESSX_HAS_ONNXRUNTIME=0)
    endif()
else()
    message(STATUS "ONNX Runtime disabled by configuration.")
    add_compile_definitions(NOISELESSX_HAS_ONNXRUNTIME=0)
endif()

# Include directories
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/dsp
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/dsp/pffft
    ${CMAKE_CURRENT_SOURCE_DIR}/config
)

# Core library interface scaffolding
add_library(noiselessx_core INTERFACE)
target_include_directories(noiselessx_core INTERFACE
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/dsp
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/dsp/pffft
)

# DSP Subsystem Library (PFFFT + STFT + VAD + Biquad + DC Blocker + Mono Pipeline)
set(DSP_SOURCES
    embedded/dsp/pffft/pffft.c
    embedded/dsp/pffft/pffft_common.c
    embedded/dsp/stft.cpp
    embedded/dsp/vad.cpp
    embedded/dsp/mono_pipeline.cpp
    embedded/dsp/nlms.cpp
    embedded/dsp/dual_mic_pipeline.cpp
)

add_library(noiselessx_dsp STATIC ${DSP_SOURCES})
target_include_directories(noiselessx_dsp PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/dsp
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/dsp/pffft
)
target_link_libraries(noiselessx_dsp PUBLIC noiselessx_core)

# Audio Subsystem Library
set(AUDIO_SOURCES
    embedded/audio/device_enumerator.cpp
    embedded/audio/alsa_backend.cpp
)

add_library(noiselessx_audio STATIC ${AUDIO_SOURCES})
target_include_directories(noiselessx_audio PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/audio
)
target_link_libraries(noiselessx_audio PUBLIC noiselessx_core noiselessx_dsp)

if(ENABLE_ALSA AND ALSA_FOUND)
    target_link_libraries(noiselessx_audio PUBLIC ${ALSA_LIBRARIES})
    target_include_directories(noiselessx_audio PUBLIC ${ALSA_INCLUDE_DIRS})
endif()

if(ENABLE_ONNXRUNTIME AND ONNXRUNTIME_LIB)
    target_link_libraries(noiselessx_core INTERFACE ${ONNXRUNTIME_LIB})
    target_include_directories(noiselessx_core INTERFACE ${ONNXRUNTIME_INCLUDE_DIR})
endif()

# AI Inference Subsystem Library (SpeechEnhancer ONNX Runtime C++ Engine)
set(AI_SOURCES
    embedded/ai/onnx_engine.cpp
)

add_library(noiselessx_ai STATIC ${AI_SOURCES})
target_include_directories(noiselessx_ai PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/ai
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/dsp
)
target_link_libraries(noiselessx_ai PUBLIC noiselessx_core noiselessx_dsp)

if(ENABLE_ONNXRUNTIME AND ONNXRUNTIME_LIB)
    target_link_libraries(noiselessx_ai PUBLIC ${ONNXRUNTIME_LIB})
    target_include_directories(noiselessx_ai PUBLIC ${ONNXRUNTIME_INCLUDE_DIR})
endif()

# Impulsive Noise Detection Subsystem Library
set(IMPULSE_SOURCES
    embedded/impulse/impulse_detector.cpp
)

add_library(noiselessx_impulse STATIC ${IMPULSE_SOURCES})
target_include_directories(noiselessx_impulse PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/impulse
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/dsp
)
target_link_libraries(noiselessx_impulse PUBLIC noiselessx_core noiselessx_dsp)

if(ENABLE_ONNXRUNTIME AND ONNXRUNTIME_LIB)
    target_link_libraries(noiselessx_impulse PUBLIC ${ONNXRUNTIME_LIB})
    target_include_directories(noiselessx_impulse PUBLIC ${ONNXRUNTIME_INCLUDE_DIR})
endif()
# Fusion Controller Subsystem Library
set(FUSION_SOURCES
    embedded/fusion/fusion_controller.cpp
)

add_library(noiselessx_fusion STATIC ${FUSION_SOURCES})
target_include_directories(noiselessx_fusion PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/fusion
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/audio
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/dsp
)
target_link_libraries(noiselessx_fusion PUBLIC noiselessx_core noiselessx_dsp)

# Real-Time Runtime Subsystem Library
set(RUNTIME_SOURCES
    embedded/runtime/system_metrics.cpp
    embedded/runtime/realtime_pipeline.cpp
    embedded/runtime/ipc_server.cpp
)

add_library(noiselessx_runtime STATIC ${RUNTIME_SOURCES})
target_include_directories(noiselessx_runtime PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/runtime
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/audio
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/dsp
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/ai
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/impulse
    ${CMAKE_CURRENT_SOURCE_DIR}/embedded/fusion
)
target_link_libraries(noiselessx_runtime PUBLIC
    noiselessx_core
    noiselessx_audio
    noiselessx_dsp
    noiselessx_ai
    noiselessx_impulse
    noiselessx_fusion
)
if (WIN32)
    target_link_libraries(noiselessx_runtime PUBLIC ws2_32)
endif()

# Main Executable: sih26052
add_executable(sih26052 embedded/runtime/main.cpp)
target_link_libraries(sih26052 PRIVATE
    noiselessx_runtime
    noiselessx_fusion
    noiselessx_impulse
    noiselessx_ai
    noiselessx_dsp
    noiselessx_audio
    noiselessx_core
)

# Hardware Test Utility (built when ALSA is enabled or on Linux target)
if(ENABLE_ALSA)
    add_executable(audio_test tools/audio_test.cpp)
    target_link_libraries(audio_test PRIVATE noiselessx_audio noiselessx_dsp noiselessx_core)
endif()

# Standalone Latency Benchmark Utility (Target: Raspberry Pi 4/5 ARM NEON)
add_executable(benchmark tools/benchmark.cpp)
target_link_libraries(benchmark PRIVATE noiselessx_ai noiselessx_dsp noiselessx_core)

# Testing Scaffolding with GoogleTest
if(BUILD_TESTS)
    enable_testing()

    include(FetchContent)
    FetchContent_Declare(
        googletest
        URL https://github.com/google/googletest/archive/refs/tags/v1.14.0.zip
    )
    # For Windows: Prevent overriding the parent project's compiler/linker settings
    set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
    FetchContent_MakeAvailable(googletest)

    # Unit test executable covering lock-free ring buffers, drift detection, DSP pipeline, AI inference, impulse detection, fusion controller, and realtime pipeline
    add_executable(noiselessx_unit_tests
        tests/unit/test_sanity.cpp
        tests/unit/test_ring_buffer.cpp
        tests/unit/test_drift_detector.cpp
        tests/unit/test_dsp.cpp
        tests/unit/test_nlms.cpp
        tests/unit/test_speech_enhancer.cpp
        tests/unit/test_impulse_detector.cpp
        tests/unit/test_fusion_controller.cpp
        tests/unit/test_realtime_pipeline.cpp
    )

    target_link_libraries(noiselessx_unit_tests PRIVATE
        noiselessx_dsp
        noiselessx_audio
        noiselessx_ai
        noiselessx_impulse
        noiselessx_fusion
        noiselessx_runtime
        noiselessx_core
        GTest::gtest_main
    )

    include(GoogleTest)
    gtest_discover_tests(noiselessx_unit_tests)
endif()
