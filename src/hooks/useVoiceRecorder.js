import { useState, useRef, useCallback, useEffect } from 'react';

export function useVoiceRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [duration, setDuration] = useState(0);
    const [visualizerData, setVisualizerData] = useState(new Array(32).fill(0));
    const [error, setError] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const analyzerRef = useRef(null);
    const animationFrameRef = useRef(null);
    const streamRef = useRef(null);
    const timerRef = useRef(null);

    // Cleanup function
    const cleanup = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    }, []);

    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    // Update visualizer data
    const updateVisualizer = useCallback(() => {
        if (!analyzerRef.current) return;

        const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
        analyzerRef.current.getByteFrequencyData(dataArray);

        // Sample 32 frequency bins for visualization
        const samples = [];
        const step = Math.floor(dataArray.length / 32);
        for (let i = 0; i < 32; i++) {
            samples.push(dataArray[i * step] / 255);
        }
        setVisualizerData(samples);

        if (isRecording) {
            animationFrameRef.current = requestAnimationFrame(updateVisualizer);
        }
    }, [isRecording]);

    // Start recording
    const startRecording = useCallback(async () => {
        try {
            setError(null);
            audioChunksRef.current = [];
            setAudioBlob(null);
            setAudioUrl(null);
            setDuration(0);

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });
            streamRef.current = stream;

            // Set up audio analyzer for visualization
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            const analyzer = audioContext.createAnalyser();
            analyzer.fftSize = 256;
            source.connect(analyzer);
            analyzerRef.current = analyzer;

            // Set up media recorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                cleanup();
            };

            mediaRecorder.start(100); // Collect data every 100ms
            setIsRecording(true);

            // Start timer
            const startTime = Date.now();
            timerRef.current = setInterval(() => {
                setDuration(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);

            // Start visualizer
            updateVisualizer();

        } catch (err) {
            setError('Microphone access denied. Please allow microphone access to record.');
            console.error('Recording error:', err);
        }
    }, [cleanup, updateVisualizer]);

    // Stop recording
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setVisualizerData(new Array(32).fill(0));
        }
    }, [isRecording]);

    // Clear recording
    const clearRecording = useCallback(() => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioBlob(null);
        setAudioUrl(null);
        setDuration(0);
        setVisualizerData(new Array(32).fill(0));
    }, [audioUrl]);

    return {
        isRecording,
        audioBlob,
        audioUrl,
        duration,
        visualizerData,
        error,
        startRecording,
        stopRecording,
        clearRecording
    };
}
