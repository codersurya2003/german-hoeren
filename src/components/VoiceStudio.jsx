import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic, MicOff, Play, Pause, RotateCcw, Volume2,
    CheckCircle, XCircle, Sparkles, Target, TrendingUp,
    ChevronRight, ChevronLeft
} from 'lucide-react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTTS } from '../hooks/useTTS';
import { getDailyWords } from '../data/words';

export function VoiceStudio() {
    // Use useState with lazy initialization to keep words stable across re-renders
    const [words] = useState(() => getDailyWords());
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [difficulty, setDifficulty] = useState(1); // 1-5 difficulty levels
    const [showResult, setShowResult] = useState(false);
    const [isPlayingNative, setIsPlayingNative] = useState(false);
    const [pronunciationResult, setPronunciationResult] = useState(null);

    // Difficulty levels configuration
    const difficultyLevels = [
        { level: 1, name: 'A1 Beginner', icon: '🌱', color: '#22C55E', description: 'Single words' },
        { level: 2, name: 'A2 Elementary', icon: '🌿', color: '#84CC16', description: 'Short phrases' },
        { level: 3, name: 'B1 Intermediate', icon: '🌳', color: '#F59E0B', description: 'Simple sentences' },
        { level: 4, name: 'B2 Advanced', icon: '🔥', color: '#F97316', description: 'Complex sentences' },
        { level: 5, name: 'C1 Expert', icon: '⭐', color: '#EF4444', description: 'Long sentences' }
    ];

    const currentDifficulty = difficultyLevels.find(d => d.level === difficulty);
    const currentWord = words[currentWordIndex];

    // Get practice text based on difficulty
    const getPracticeText = () => {
        switch (difficulty) {
            case 1: return currentWord.german; // Single word
            case 2: return currentWord.phrase || currentWord.german; // Short phrase
            case 3: return currentWord.example.split('.')[0] + '.'; // First sentence
            case 4: return currentWord.example; // Full sentence
            case 5: return currentWord.example + ' ' + (currentWord.phrase ? `Das bedeutet: ${currentWord.phrase}.` : ''); // Extended
            default: return currentWord.german;
        }
    };
    const practiceText = getPracticeText();

    const {
        isRecording, audioUrl, duration, visualizerData,
        startRecording, stopRecording, clearRecording, error: recorderError
    } = useVoiceRecorder();

    const {
        isListening, transcript, interimTranscript, confidence,
        startListening, stopListening, resetTranscript, analyzePronunciation,
        isSupported: speechSupported
    } = useSpeechRecognition();

    const { speak } = useTTS();
    const audioRef = useRef(null);

    // Handle recording with speech recognition
    const handleStartRecording = () => {
        clearRecording();
        resetTranscript();
        setShowResult(false);
        setPronunciationResult(null);
        startRecording();
        if (speechSupported) {
            startListening();
        }
    };

    const handleStopRecording = () => {
        stopRecording();
        stopListening();

        // Analyze pronunciation after a short delay
        setTimeout(() => {
            const result = analyzePronunciation(practiceText, transcript);
            setPronunciationResult(result);
            setShowResult(true);
        }, 500);
    };

    // Play native pronunciation
    const handlePlayNative = () => {
        setIsPlayingNative(true);
        speak(practiceText);
        setTimeout(() => setIsPlayingNative(false), 2000);
    };

    // Navigate words
    const nextWord = () => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        clearRecording();
        resetTranscript();
        setShowResult(false);
        setPronunciationResult(null);
    };

    const prevWord = () => {
        setCurrentWordIndex((prev) => (prev - 1 + words.length) % words.length);
        clearRecording();
        resetTranscript();
        setShowResult(false);
        setPronunciationResult(null);
    };

    // Type colors
    const typeColors = {
        'Noun (m)': '#3B82F6',
        'Noun (f)': '#EC4899',
        'Noun (n)': '#22C55E',
        'Verb': '#F59E0B',
        'Adjective': '#8B5CF6',
        'default': '#FFD700'
    };
    const accentColor = typeColors[currentWord?.type] || typeColors.default;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Difficulty Level Selector */}
            <div className="mb-8">
                <div className="text-center mb-4">
                    <span className="text-2xl mr-2">{currentDifficulty.icon}</span>
                    <span className="text-xl font-bold" style={{ color: currentDifficulty.color }}>
                        {currentDifficulty.name}
                    </span>
                    <span className="text-gray-400 ml-2">• {currentDifficulty.description}</span>
                </div>

                {/* Slider Track */}
                <div className="relative max-w-md mx-auto">
                    <div className="flex justify-between mb-2">
                        {difficultyLevels.map((d) => (
                            <motion.button
                                key={d.level}
                                onClick={() => setDifficulty(d.level)}
                                className="flex flex-col items-center group"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all"
                                    style={{
                                        background: difficulty >= d.level
                                            ? `linear-gradient(135deg, ${d.color}40, ${d.color}20)`
                                            : 'rgba(255, 255, 255, 0.05)',
                                        border: `2px solid ${difficulty >= d.level ? d.color : 'rgba(255, 255, 255, 0.1)'}`,
                                        color: difficulty >= d.level ? d.color : '#64748b',
                                        boxShadow: difficulty === d.level ? `0 0 20px ${d.color}40` : 'none'
                                    }}
                                    animate={{
                                        scale: difficulty === d.level ? 1.15 : 1
                                    }}
                                >
                                    {d.icon}
                                </motion.div>
                                <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ color: d.color }}>
                                    {d.name.split(' ')[0]}
                                </span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                background: `linear-gradient(90deg, ${difficultyLevels[0].color}, ${currentDifficulty.color})`
                            }}
                            initial={{ width: '20%' }}
                            animate={{ width: `${(difficulty / 5) * 100}%` }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Practice Card */}
            <motion.div
                className="rounded-3xl p-8 mb-6"
                style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 1) 100%)',
                    border: `2px solid ${accentColor}40`,
                    boxShadow: `0 20px 60px -15px rgba(0, 0, 0, 0.5), 0 0 40px -20px ${accentColor}30`
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Word Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <motion.button
                        onClick={prevWord}
                        className="p-2 rounded-full"
                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronLeft size={24} />
                    </motion.button>

                    <div className="text-center">
                        <span
                            className="text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full"
                            style={{ background: `${accentColor}20`, color: accentColor }}
                        >
                            {currentWord?.type}
                        </span>
                    </div>

                    <motion.button
                        onClick={nextWord}
                        className="p-2 rounded-full"
                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronRight size={24} />
                    </motion.button>
                </div>

                {/* Practice Text */}
                <div className="text-center mb-8">
                    <motion.h2
                        key={practiceText}
                        className={`font-bold text-white mb-3 ${difficulty <= 2 ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {practiceText}
                    </motion.h2>
                    {difficulty === 1 && (
                        <p className="text-xl text-gray-400">{currentWord?.english}</p>
                    )}
                    {difficulty >= 2 && (
                        <p className="text-sm text-gray-500">{currentWord?.english}</p>
                    )}
                </div>

                {/* Native Audio Button */}
                <div className="flex justify-center mb-8">
                    <motion.button
                        onClick={handlePlayNative}
                        className="flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold"
                        style={{
                            background: isPlayingNative ? accentColor : 'rgba(255, 255, 255, 0.1)',
                            color: isPlayingNative ? '#000' : '#fff',
                            border: `1px solid ${isPlayingNative ? accentColor : 'rgba(255, 255, 255, 0.2)'}`
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={false}
                    >
                        <Volume2 size={20} className={isPlayingNative ? 'animate-pulse' : ''} />
                        Listen to Native
                    </motion.button>
                </div>

                {/* Audio Visualizer */}
                <div className="h-24 flex items-center justify-center gap-1 mb-8">
                    {visualizerData.map((value, index) => (
                        <motion.div
                            key={index}
                            className="w-2 rounded-full"
                            style={{ background: accentColor }}
                            animate={{
                                height: isRecording ? `${Math.max(8, value * 80)}px` : '8px',
                                opacity: isRecording ? 0.5 + value * 0.5 : 0.3
                            }}
                            transition={{ duration: 0.05 }}
                        />
                    ))}
                </div>

                {/* Recording Controls */}
                <div className="flex justify-center gap-4">
                    {!isRecording ? (
                        <motion.button
                            onClick={handleStartRecording}
                            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-xl"
                            style={{
                                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}CC 100%)`,
                                color: '#000',
                                boxShadow: `0 10px 40px ${accentColor}40`
                            }}
                            whileHover={{ scale: 1.05, boxShadow: `0 15px 50px ${accentColor}60` }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Mic size={24} />
                            Start Recording
                        </motion.button>
                    ) : (
                        <motion.button
                            onClick={handleStopRecording}
                            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-xl"
                            style={{
                                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                color: '#fff',
                                boxShadow: '0 10px 40px rgba(239, 68, 68, 0.4)'
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{
                                boxShadow: [
                                    '0 10px 40px rgba(239, 68, 68, 0.4)',
                                    '0 10px 60px rgba(239, 68, 68, 0.6)',
                                    '0 10px 40px rgba(239, 68, 68, 0.4)'
                                ]
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <MicOff size={24} />
                            Stop ({duration}s)
                        </motion.button>
                    )}

                    {audioUrl && !isRecording && (
                        <motion.button
                            onClick={clearRecording}
                            className="flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold"
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <RotateCcw size={20} />
                            Try Again
                        </motion.button>
                    )}
                </div>

                {/* Error Display */}
                {recorderError && (
                    <motion.div
                        className="mt-4 p-4 rounded-xl text-center"
                        style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {recorderError}
                    </motion.div>
                )}

                {/* Playback Audio */}
                {audioUrl && (
                    <audio ref={audioRef} src={audioUrl} className="hidden" />
                )}
            </motion.div>

            {/* Results Panel */}
            <AnimatePresence>
                {showResult && pronunciationResult && (
                    <motion.div
                        className="rounded-3xl p-8"
                        style={{
                            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 1) 100%)',
                            border: `2px solid ${pronunciationResult.fluencyRating.color}40`
                        }}
                        initial={{ opacity: 0, y: 20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                    >
                        {/* Score Display */}
                        <div className="text-center mb-8">
                            <motion.div
                                className="text-8xl font-black mb-2"
                                style={{ color: pronunciationResult.fluencyRating.color }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                            >
                                {pronunciationResult.overallScore}%
                            </motion.div>
                            <div className="flex items-center justify-center gap-2 text-2xl">
                                <span>{pronunciationResult.fluencyRating.emoji}</span>
                                <span style={{ color: pronunciationResult.fluencyRating.color }}>
                                    {pronunciationResult.fluencyRating.label}
                                </span>
                            </div>
                        </div>

                        {/* What you said */}
                        <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                            <p className="text-sm text-gray-400 mb-1">What we heard:</p>
                            <p className="text-xl text-white">
                                {transcript || <span className="text-gray-500 italic">No speech detected</span>}
                            </p>
                        </div>

                        {/* Word-by-word Analysis */}
                        {pronunciationResult.wordScores && pronunciationResult.wordScores.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                                    Word Analysis
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {pronunciationResult.wordScores.map((word, idx) => (
                                        <motion.span
                                            key={idx}
                                            className="px-3 py-1.5 rounded-lg font-medium flex items-center gap-1"
                                            style={{
                                                background: word.correct
                                                    ? 'rgba(34, 197, 94, 0.2)'
                                                    : 'rgba(239, 68, 68, 0.2)',
                                                color: word.correct ? '#22C55E' : '#EF4444'
                                            }}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            {word.correct ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            {word.expected}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Enhanced Tips */}
                        <div className="space-y-3">
                            {pronunciationResult.tips.map((tip, idx) => (
                                <motion.div
                                    key={idx}
                                    className="p-4 rounded-xl"
                                    style={{
                                        background: tip.type === 'success'
                                            ? 'rgba(34, 197, 94, 0.15)'
                                            : tip.type === 'error'
                                                ? 'rgba(239, 68, 68, 0.15)'
                                                : tip.type === 'phoneme'
                                                    ? 'rgba(139, 92, 246, 0.15)'
                                                    : 'rgba(255, 215, 0, 0.1)'
                                    }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-xl">{tip.icon}</span>
                                        <div className="flex-1">
                                            {tip.type === 'phoneme' ? (
                                                <>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-purple-400">{tip.name}</span>
                                                        <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">{tip.ipa}</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm mb-2">{tip.text}</p>
                                                    <p className="text-xs text-gray-500">
                                                        ⚠️ Common mistake: {tip.commonMistake}
                                                    </p>
                                                    {tip.examples && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {tip.examples.slice(0, 3).map((ex, i) => (
                                                                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
                                                                    {ex}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-gray-300" style={{
                                                    color: tip.type === 'success' ? '#22C55E'
                                                        : tip.type === 'error' ? '#EF4444'
                                                            : '#FFD700'
                                                }}>
                                                    {tip.text}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Playback Buttons */}
                        {audioUrl && (
                            <div className="flex justify-center gap-4 mt-6">
                                <motion.button
                                    onClick={() => audioRef.current?.play()}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium"
                                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Play size={18} />
                                    Play Your Recording
                                </motion.button>
                                <motion.button
                                    onClick={handlePlayNative}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium"
                                    style={{ background: `${accentColor}20`, color: accentColor }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Volume2 size={18} />
                                    Compare with Native
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Speech Recognition Warning */}
            {!speechSupported && (
                <motion.div
                    className="mt-4 p-4 rounded-xl text-center"
                    style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    ⚠️ Speech recognition is not supported in this browser. Try Chrome for the best experience.
                </motion.div>
            )}
        </div>
    );
}
