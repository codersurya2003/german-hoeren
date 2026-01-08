import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Flame, Trophy, Star, Zap, TrendingUp, Calendar,
    Award, CheckCircle, Lock, Crown, Target, Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFirebaseProgress } from '../hooks/useFirebaseProgress';
import { achievements, levels, getCurrentLevel, getLevelProgress } from '../data/gameData';

export function ProgressDashboard() {
    const { currentUser } = useAuth();
    const {
        loading, xp, streak, stats, unlockedAchievements,
        level, syncLocalProgress
    } = useFirebaseProgress();

    const [showAchievementDetails, setShowAchievementDetails] = useState(null);

    // Sync local progress on first load
    useEffect(() => {
        if (currentUser) {
            syncLocalProgress();
        }
    }, [currentUser, syncLocalProgress]);

    // Get level progress
    const levelProgress = getLevelProgress(xp);
    const nextLevel = levels.find(l => l.level === level.level + 1);
    const xpToNext = nextLevel ? nextLevel.minXp - xp : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-yellow-400" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Level Card */}
                <motion.div
                    className="rounded-3xl p-6 relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 1) 100%)',
                        border: `2px solid ${level.color}40`
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="absolute top-0 left-0 right-0 h-1"
                        style={{ background: `linear-gradient(90deg, transparent, ${level.color}, transparent)` }} />

                    <div className="flex items-center gap-4 mb-4">
                        <motion.div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black"
                            style={{
                                background: `${level.color}20`,
                                border: `2px solid ${level.color}`,
                                color: level.color
                            }}
                            animate={{
                                boxShadow: [
                                    `0 0 20px ${level.color}20`,
                                    `0 0 40px ${level.color}40`,
                                    `0 0 20px ${level.color}20`
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            {level.level}
                        </motion.div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">{level.name}</h3>
                            <p className="text-gray-400">{xp.toLocaleString()} XP</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative">
                        <div className="h-3 rounded-full bg-gray-700/50 overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: `linear-gradient(90deg, ${level.color}, ${level.color}CC)` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${levelProgress}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        </div>
                        {nextLevel && (
                            <p className="text-xs text-gray-500 mt-2 text-right">
                                {xpToNext} XP to {nextLevel.name}
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Streak Card */}
                <motion.div
                    className="rounded-3xl p-6 relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 1) 100%)',
                        border: '2px solid rgba(249, 115, 22, 0.4)'
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="absolute top-0 left-0 right-0 h-1"
                        style={{ background: 'linear-gradient(90deg, transparent, #F97316, transparent)' }} />

                    <div className="flex items-center gap-4">
                        <motion.div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center"
                            style={{
                                background: 'rgba(249, 115, 22, 0.2)',
                                border: '2px solid #F97316'
                            }}
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <Flame size={32} className="text-orange-500" />
                        </motion.div>
                        <div>
                            <motion.h3
                                className="text-5xl font-black text-orange-400"
                                key={streak}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                            >
                                {streak}
                            </motion.h3>
                            <p className="text-gray-400">Day Streak</p>
                        </div>
                    </div>

                    <div className="flex gap-1 mt-4">
                        {[...Array(7)].map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 h-2 rounded-full"
                                style={{
                                    background: i < Math.min(streak, 7)
                                        ? '#F97316'
                                        : 'rgba(255, 255, 255, 0.1)'
                                }}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Last 7 days</p>
                </motion.div>

                {/* Weekly Stats Card */}
                <motion.div
                    className="rounded-3xl p-6 relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 1) 100%)',
                        border: '2px solid rgba(34, 197, 94, 0.4)'
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="absolute top-0 left-0 right-0 h-1"
                        style={{ background: 'linear-gradient(90deg, transparent, #22C55E, transparent)' }} />

                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-green-400" />
                        Weekly Progress
                    </h4>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Words Learned</span>
                            <span className="text-white font-bold">{stats.wordsLearned || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Exams Taken</span>
                            <span className="text-white font-bold">{stats.examsTaken || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Voice Sessions</span>
                            <span className="text-white font-bold">{stats.pronunciationSessions || 0}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Achievements Section */}
            <motion.div
                className="rounded-3xl p-8"
                style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 1) 100%)',
                    border: '2px solid rgba(255, 215, 0, 0.2)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Trophy size={28} className="text-yellow-400" />
                    Achievements
                    <span className="text-sm font-normal text-gray-400 ml-2">
                        {unlockedAchievements.length}/{achievements.length} unlocked
                    </span>
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {achievements.map((achievement, index) => {
                        const isUnlocked = unlockedAchievements.includes(achievement.id);

                        return (
                            <motion.div
                                key={achievement.id}
                                className="relative rounded-2xl p-4 cursor-pointer transition-all"
                                style={{
                                    background: isUnlocked
                                        ? 'rgba(255, 215, 0, 0.1)'
                                        : 'rgba(255, 255, 255, 0.03)',
                                    border: `1px solid ${isUnlocked ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                                    opacity: isUnlocked ? 1 : 0.6
                                }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: isUnlocked ? 1 : 0.6, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.05, opacity: 1 }}
                                onClick={() => setShowAchievementDetails(achievement)}
                            >
                                <div className="text-center">
                                    <motion.div
                                        className="text-4xl mb-2"
                                        animate={isUnlocked ? {
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 10, -10, 0]
                                        } : {}}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {isUnlocked ? achievement.icon : <Lock size={32} className="mx-auto text-gray-600" />}
                                    </motion.div>
                                    <h4 className={`font-semibold text-sm ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                                        {achievement.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        +{achievement.xpReward} XP
                                    </p>
                                </div>

                                {isUnlocked && (
                                    <motion.div
                                        className="absolute -top-1 -right-1"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', delay: 0.3 }}
                                    >
                                        <CheckCircle size={20} className="text-green-400" fill="#22C55E" />
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Achievement Details Modal */}
            <AnimatePresence>
                {showAchievementDetails && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(0, 0, 0, 0.8)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAchievementDetails(null)}
                    >
                        <motion.div
                            className="rounded-3xl p-8 max-w-md w-full text-center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%)',
                                border: '2px solid rgba(255, 215, 0, 0.3)'
                            }}
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-6xl mb-4">{showAchievementDetails.icon}</div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {showAchievementDetails.name}
                            </h3>
                            <p className="text-gray-400 mb-4">
                                {showAchievementDetails.description}
                            </p>
                            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full mx-auto w-fit"
                                style={{ background: 'rgba(255, 215, 0, 0.2)' }}>
                                <Zap size={16} className="text-yellow-400" />
                                <span className="text-yellow-400 font-bold">
                                    +{showAchievementDetails.xpReward} XP
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
