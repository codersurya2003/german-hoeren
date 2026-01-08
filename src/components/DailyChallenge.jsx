import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Timer, Trophy, Mic, Volume2, RefreshCw,
    Check, X, ChevronRight, Star, Flame
} from 'lucide-react';
import { challengeTemplates, xpRewards } from '../data/gameData';
import { getDailyWords } from '../data/words';
import { useTTS } from '../hooks/useTTS';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';

export function DailyChallenge() {
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [challengeState, setChallengeState] = useState('intro'); // 'intro', 'active', 'completed'
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [tonguePhrase, setTonguePhrase] = useState('');
    const [speedRoundAnswers, setSpeedRoundAnswers] = useState([]);
    const [currentSpeedQuestion, setCurrentSpeedQuestion] = useState(0);

    const { speak } = useTTS();
    const { isRecording, startRecording, stopRecording, audioUrl } = useVoiceRecorder();
    const dailyWords = getDailyWords();

    // Get today's challenge (based on day of week)
    useEffect(() => {
        const dayIndex = new Date().getDay();
        const challenge = challengeTemplates[dayIndex % challengeTemplates.length];
        setCurrentChallenge(challenge);

        if (challenge.id === 'tongue_twister') {
            const phrases = challenge.phrases;
            setTonguePhrase(phrases[Math.floor(Math.random() * phrases.length)]);
        }
    }, []);

    // Timer for speed round
    useEffect(() => {
        let interval;
        if (challengeState === 'active' && currentChallenge?.id === 'speed_round' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setChallengeState('completed');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [challengeState, currentChallenge, timeLeft]);

    // Generate speed round questions
    const generateSpeedQuestions = useCallback(() => {
        const questions = dailyWords.map(word => ({
            german: word.german,
            english: word.english,
            options: shuffleArray([
                word.english,
                ...dailyWords
                    .filter(w => w.id !== word.id)
                    .slice(0, 3)
                    .map(w => w.english)
            ])
        }));
        return shuffleArray(questions);
    }, [dailyWords]);

    const startChallenge = () => {
        setChallengeState('active');
        setScore(0);

        if (currentChallenge?.id === 'speed_round') {
            setTimeLeft(currentChallenge.timeLimit || 60);
            setSpeedRoundAnswers(generateSpeedQuestions());
            setCurrentSpeedQuestion(0);
        }
    };

    const handleSpeedAnswer = (answer, correctAnswer) => {
        if (answer === correctAnswer) {
            setScore(prev => prev + 10);
        }

        if (currentSpeedQuestion < speedRoundAnswers.length - 1) {
            setCurrentSpeedQuestion(prev => prev + 1);
        } else {
            setChallengeState('completed');
        }
    };

    const resetChallenge = () => {
        setChallengeState('intro');
        setScore(0);
        setTimeLeft(0);
        setCurrentSpeedQuestion(0);
    };

    if (!currentChallenge) return null;

    const challengeColors = {
        'tongue_twister': '#EC4899',
        'speed_round': '#F59E0B',
        'listening_challenge': '#3B82F6',
        'story_time': '#22C55E'
    };

    const accentColor = challengeColors[currentChallenge.id] || '#FFD700';

    return (
        <div className="max-w-3xl mx-auto">
            {/* Challenge Header */}
            <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <motion.div
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                    style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40` }}
                    animate={{
                        boxShadow: [
                            `0 0 20px ${accentColor}20`,
                            `0 0 40px ${accentColor}40`,
                            `0 0 20px ${accentColor}20`
                        ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <Zap size={16} style={{ color: accentColor }} />
                    <span className="text-sm font-semibold" style={{ color: accentColor }}>
                        Daily Challenge
                    </span>
                </motion.div>
            </motion.div>

            {/* Challenge Card */}
            <motion.div
                className="rounded-3xl p-8 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 1) 100%)',
                    border: `2px solid ${accentColor}40`
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                {/* Glow effect */}
                <div className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />

                <AnimatePresence mode="wait">
                    {/* Intro State */}
                    {challengeState === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center"
                        >
                            <div className="text-6xl mb-6">{currentChallenge.icon}</div>
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {currentChallenge.name}
                            </h2>
                            <p className="text-gray-400 text-lg mb-8">
                                {currentChallenge.description}
                            </p>

                            {/* Challenge-specific info */}
                            {currentChallenge.id === 'tongue_twister' && (
                                <div className="mb-8 p-6 rounded-2xl"
                                    style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                                    <p className="text-2xl text-white font-medium italic">
                                        "{tonguePhrase}"
                                    </p>
                                    <motion.button
                                        onClick={() => speak(tonguePhrase)}
                                        className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-xl"
                                        style={{ background: `${accentColor}20`, color: accentColor }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <Volume2 size={18} />
                                        Listen First
                                    </motion.button>
                                </div>
                            )}

                            {currentChallenge.id === 'speed_round' && (
                                <div className="mb-8 flex items-center justify-center gap-6">
                                    <div className="text-center">
                                        <Timer size={32} className="mx-auto mb-2" style={{ color: accentColor }} />
                                        <p className="text-2xl font-bold text-white">{currentChallenge.timeLimit}s</p>
                                        <p className="text-sm text-gray-400">Time Limit</p>
                                    </div>
                                    <div className="text-center">
                                        <Star size={32} className="mx-auto mb-2" style={{ color: accentColor }} />
                                        <p className="text-2xl font-bold text-white">10</p>
                                        <p className="text-sm text-gray-400">Points Each</p>
                                    </div>
                                </div>
                            )}

                            <motion.button
                                onClick={startChallenge}
                                className="px-10 py-4 rounded-2xl font-bold text-xl text-black"
                                style={{
                                    background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}CC 100%)`,
                                    boxShadow: `0 10px 40px ${accentColor}40`
                                }}
                                whileHover={{ scale: 1.05, boxShadow: `0 15px 50px ${accentColor}60` }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Start Challenge
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Active State - Speed Round */}
                    {challengeState === 'active' && currentChallenge.id === 'speed_round' && (
                        <motion.div
                            key="speed-active"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Timer & Score */}
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-2">
                                    <Timer size={24} style={{ color: timeLeft <= 10 ? '#EF4444' : accentColor }} />
                                    <span className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                                        {timeLeft}s
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star size={24} style={{ color: accentColor }} />
                                    <span className="text-3xl font-bold text-white">{score}</span>
                                </div>
                            </div>

                            {/* Question */}
                            {speedRoundAnswers[currentSpeedQuestion] && (
                                <div className="text-center">
                                    <motion.h3
                                        key={currentSpeedQuestion}
                                        className="text-4xl font-bold text-white mb-8"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        {speedRoundAnswers[currentSpeedQuestion].german}
                                    </motion.h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        {speedRoundAnswers[currentSpeedQuestion].options.map((option, idx) => (
                                            <motion.button
                                                key={idx}
                                                onClick={() => handleSpeedAnswer(option, speedRoundAnswers[currentSpeedQuestion].english)}
                                                className="p-4 rounded-2xl text-lg font-medium text-white transition-all"
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '2px solid rgba(255, 255, 255, 0.1)'
                                                }}
                                                whileHover={{
                                                    scale: 1.02,
                                                    background: `${accentColor}20`,
                                                    borderColor: `${accentColor}40`
                                                }}
                                                whileTap={{ scale: 0.98 }}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                            >
                                                {option}
                                            </motion.button>
                                        ))}
                                    </div>

                                    {/* Progress */}
                                    <div className="mt-6 flex justify-center gap-1">
                                        {speedRoundAnswers.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className="w-2 h-2 rounded-full transition-all"
                                                style={{
                                                    background: idx < currentSpeedQuestion ? accentColor
                                                        : idx === currentSpeedQuestion ? '#fff'
                                                            : 'rgba(255, 255, 255, 0.2)'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Active State - Tongue Twister */}
                    {challengeState === 'active' && currentChallenge.id === 'tongue_twister' && (
                        <motion.div
                            key="tongue-active"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center"
                        >
                            <p className="text-2xl text-white font-medium italic mb-8">
                                "{tonguePhrase}"
                            </p>

                            <div className="flex justify-center gap-4 mb-6">
                                <motion.button
                                    onClick={() => speak(tonguePhrase)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl"
                                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Volume2 size={20} />
                                    Listen
                                </motion.button>

                                {!isRecording ? (
                                    <motion.button
                                        onClick={startRecording}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-black font-bold"
                                        style={{ background: accentColor }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <Mic size={20} />
                                        Record
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        onClick={() => {
                                            stopRecording();
                                            setScore(prev => prev + 25);
                                            setChallengeState('completed');
                                        }}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white font-bold"
                                        whileHover={{ scale: 1.05 }}
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                    >
                                        <Mic size={20} />
                                        Stop
                                    </motion.button>
                                )}
                            </div>

                            {audioUrl && (
                                <audio src={audioUrl} controls className="mx-auto" />
                            )}
                        </motion.div>
                    )}

                    {/* Completed State */}
                    {challengeState === 'completed' && (
                        <motion.div
                            key="completed"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                            >
                                <Trophy size={80} className="mx-auto mb-4" style={{ color: accentColor }} />
                            </motion.div>

                            <h2 className="text-3xl font-bold text-white mb-2">
                                Challenge Complete!
                            </h2>

                            <motion.div
                                className="text-6xl font-black mb-4"
                                style={{ color: accentColor }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.4 }}
                            >
                                +{score} XP
                            </motion.div>

                            <div className="flex justify-center gap-4">
                                <motion.button
                                    onClick={resetChallenge}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium"
                                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <RefreshCw size={18} />
                                    Try Again
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* XP Reward Preview */}
            <motion.div
                className="mt-6 text-center text-gray-500 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <Flame size={16} className="text-orange-400" />
                <span>Complete daily challenges to earn bonus XP and maintain your streak!</span>
            </motion.div>
        </div>
    );
}

// Helper function to shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
