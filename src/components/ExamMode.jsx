import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, CheckCircle, XCircle, ArrowRight, RefreshCcw, Award, Target, Flame } from 'lucide-react';
import { useTTS } from '../hooks/useTTS';
import { generateQuestions } from '../data/questions';

export function ExamMode() {
    const [questions, setQuestions] = useState(() => generateQuestions(10));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const { speak } = useTTS();

    const question = questions[currentIndex];
    const isLast = currentIndex === questions.length - 1;

    const handleOptionClick = (option) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);
        if (option === question.correct) {
            setScore(s => s + 1);
            setStreak(s => s + 1);
        } else {
            setStreak(0);
        }
    };

    const handleNext = () => {
        if (isLast) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(currentIndex + 1);
            setIsAnswered(false);
            setSelectedOption(null);
        }
    };

    const resetExam = () => {
        setQuestions(generateQuestions(10));
        setCurrentIndex(0);
        setScore(0);
        setStreak(0);
        setIsAnswered(false);
        setSelectedOption(null);
    };

    // Calculate performance message
    const getPerformanceMessage = () => {
        const percentage = (score / questions.length) * 100;
        if (percentage >= 90) return { text: "Outstanding!", color: "#22C55E", emoji: "🏆" };
        if (percentage >= 70) return { text: "Great work!", color: "#F59E0B", emoji: "⭐" };
        if (percentage >= 50) return { text: "Good effort!", color: "#3B82F6", emoji: "👍" };
        return { text: "Keep practicing!", color: "#EC4899", emoji: "💪" };
    };

    // Finished State
    if (currentIndex >= questions.length) {
        const performance = getPerformanceMessage();

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="p-10 text-center max-w-lg mx-auto rounded-3xl relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                {/* Celebration particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                                background: ['#FFD700', '#22C55E', '#3B82F6', '#EC4899'][i % 4],
                                left: `${10 + (i * 8)}%`,
                                top: '50%'
                            }}
                            animate={{
                                y: [-20, -100 - Math.random() * 50],
                                x: [0, (Math.random() - 0.5) * 60],
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                delay: i * 0.1,
                                repeat: Infinity,
                                repeatDelay: 2
                            }}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-6xl mb-4"
                >
                    {performance.emoji}
                </motion.div>

                <h2 className="text-3xl font-bold mb-2 text-white">Exam Complete!</h2>
                <p className="text-xl font-semibold mb-6" style={{ color: performance.color }}>
                    {performance.text}
                </p>

                <motion.div
                    className="relative mb-8"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                    <div
                        className="w-32 h-32 mx-auto rounded-full flex items-center justify-center"
                        style={{
                            background: `conic-gradient(${performance.color} ${(score / questions.length) * 360}deg, rgba(255,255,255,0.1) 0deg)`,
                            boxShadow: `0 0 40px ${performance.color}40`
                        }}
                    >
                        <div
                            className="w-24 h-24 rounded-full flex flex-col items-center justify-center"
                            style={{ background: 'rgba(15, 23, 42, 0.95)' }}
                        >
                            <span className="text-4xl font-bold text-white">{score}</span>
                            <span className="text-sm text-gray-400">/ {questions.length}</span>
                        </div>
                    </div>
                </motion.div>

                <motion.button
                    onClick={resetExam}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-black transition-all"
                    style={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        boxShadow: '0 8px 30px rgba(255, 215, 0, 0.4)'
                    }}
                    whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(255, 215, 0, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                >
                    <RefreshCcw size={20} /> Try Again
                </motion.button>
            </motion.div>
        );
    }

    return (
        <div
            className="p-8 max-w-2xl mx-auto w-full rounded-3xl relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                minHeight: '580px'
            }}
        >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-800/50 overflow-hidden">
                <motion.div
                    className="h-full"
                    style={{
                        background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-8 pt-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Target size={16} style={{ color: '#94a3b8' }} />
                        <span className="text-sm font-semibold text-gray-400">
                            Question {currentIndex + 1} / {questions.length}
                        </span>
                    </div>

                    {streak > 1 && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                            style={{
                                background: 'rgba(249, 115, 22, 0.2)',
                                border: '1px solid rgba(249, 115, 22, 0.3)'
                            }}
                        >
                            <Flame size={14} style={{ color: '#F97316' }} />
                            <span className="text-xs font-bold" style={{ color: '#F97316' }}>
                                {streak} streak
                            </span>
                        </motion.div>
                    )}
                </div>

                <span
                    className="text-xs uppercase px-4 py-1.5 rounded-full font-bold"
                    style={{
                        background: question.type === 'listening' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: question.type === 'listening' ? '#EC4899' : '#3B82F6',
                        border: `1px solid ${question.type === 'listening' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                    }}
                >
                    {question.type}
                </span>
            </div>

            {/* Question Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col"
                >
                    {/* Question */}
                    <div className="min-h-[140px] flex items-center justify-center mb-8">
                        {question.type === 'listening' ? (
                            <div className="flex flex-col items-center gap-5">
                                <motion.button
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => speak(question.textToSpeak)}
                                    className="w-24 h-24 rounded-full flex items-center justify-center relative"
                                    style={{
                                        background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
                                        boxShadow: '0 15px 40px rgba(236, 72, 153, 0.4)'
                                    }}
                                >
                                    <Volume2 size={40} className="text-white" />

                                    {/* Pulse rings */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full"
                                        style={{ border: '2px solid rgba(236, 72, 153, 0.5)' }}
                                        animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                    <motion.div
                                        className="absolute inset-0 rounded-full"
                                        style={{ border: '2px solid rgba(236, 72, 153, 0.3)' }}
                                        animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                                    />
                                </motion.button>
                                <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>
                                    Click to listen
                                </span>
                            </div>
                        ) : (
                            <h2 className="text-2xl font-semibold text-center text-white leading-relaxed px-4">
                                {question.question}
                            </h2>
                        )}
                    </div>

                    {/* Options */}
                    <div className="space-y-3 mb-6">
                        {question.options.map((option, idx) => {
                            let bgStyle = 'rgba(255, 255, 255, 0.05)';
                            let borderStyle = 'rgba(255, 255, 255, 0.1)';
                            let icon = null;

                            if (isAnswered) {
                                if (option === question.correct) {
                                    bgStyle = 'rgba(34, 197, 94, 0.15)';
                                    borderStyle = 'rgba(34, 197, 94, 0.5)';
                                    icon = <CheckCircle size={22} style={{ color: '#22C55E' }} />;
                                } else if (option === selectedOption) {
                                    bgStyle = 'rgba(239, 68, 68, 0.15)';
                                    borderStyle = 'rgba(239, 68, 68, 0.5)';
                                    icon = <XCircle size={22} style={{ color: '#EF4444' }} />;
                                }
                            }

                            return (
                                <motion.button
                                    key={option}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.06 }}
                                    onClick={() => handleOptionClick(option)}
                                    disabled={isAnswered}
                                    className="w-full flex items-center justify-between p-5 rounded-2xl transition-all text-left"
                                    style={{
                                        background: bgStyle,
                                        border: `2px solid ${borderStyle}`,
                                        opacity: isAnswered && option !== question.correct && option !== selectedOption ? 0.4 : 1
                                    }}
                                    whileHover={!isAnswered ? {
                                        background: 'rgba(255, 215, 0, 0.1)',
                                        borderColor: 'rgba(255, 215, 0, 0.3)',
                                        x: 4
                                    } : {}}
                                    whileTap={!isAnswered ? { scale: 0.99 } : {}}
                                >
                                    <span className="font-medium text-white text-lg">{option}</span>
                                    {icon}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Feedback Area */}
            <div className="h-28 relative">
                <AnimatePresence>
                    {isAnswered && (
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 25 }}
                            className="absolute inset-x-0 bottom-0 p-5 rounded-2xl"
                            style={{
                                background: selectedOption === question.correct
                                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(20, 83, 45, 0.3) 100%)'
                                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(127, 29, 29, 0.3) 100%)',
                                border: `1px solid ${selectedOption === question.correct ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <div className="flex justify-between items-center gap-4">
                                <div className="flex-1">
                                    <div
                                        className="font-bold mb-1 flex items-center gap-2"
                                        style={{ color: selectedOption === question.correct ? '#22C55E' : '#EF4444' }}
                                    >
                                        {selectedOption === question.correct ? (
                                            <><CheckCircle size={18} /> Richtig!</>
                                        ) : (
                                            <><XCircle size={18} /> Falsch...</>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-300 line-clamp-2">
                                        {question.explanation}
                                    </p>
                                </div>

                                <motion.button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-black shrink-0"
                                    style={{
                                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                        boxShadow: '0 6px 20px rgba(255, 215, 0, 0.35)'
                                    }}
                                    whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(255, 215, 0, 0.45)' }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {isLast ? 'Finish' : 'Next'} <ArrowRight size={18} />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
