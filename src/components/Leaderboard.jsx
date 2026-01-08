import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy, Medal, TrendingUp, Crown, Flame, Sparkles, Loader2
} from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useFirebaseProgress } from '../hooks/useFirebaseProgress';
import { sampleLeaderboard, getCurrentLevel } from '../data/gameData';

export function Leaderboard() {
    const [timeframe, setTimeframe] = useState('weekly');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { currentUser } = useAuth();
    const { xp } = useFirebaseProgress();

    // Fetch leaderboard data
    useEffect(() => {
        async function fetchLeaderboard() {
            setLoading(true);
            try {
                const leaderboardRef = collection(db, 'leaderboard', timeframe, 'users');
                const q = query(leaderboardRef, orderBy('xp', 'desc'), limit(10));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const data = snapshot.docs.map((doc, index) => ({
                        id: doc.id,
                        position: index + 1,
                        ...doc.data()
                    }));
                    setLeaderboardData(data);
                } else {
                    // Use sample data if no real data
                    setLeaderboardData(sampleLeaderboard);
                }
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
                // Fall back to sample data
                setLeaderboardData(sampleLeaderboard);
            } finally {
                setLoading(false);
            }
        }

        fetchLeaderboard();
    }, [timeframe]);

    // Sort leaderboard by XP
    const sortedLeaderboard = [...leaderboardData].sort((a, b) => b.xp - a.xp);

    // Get user's position
    const userPosition = currentUser
        ? sortedLeaderboard.findIndex(p => p.id === currentUser.uid) + 1 ||
        sortedLeaderboard.filter(p => p.xp > xp).length + 1
        : sortedLeaderboard.filter(p => p.xp > xp).length + 1;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-yellow-400" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                >
                    <Trophy size={48} className="mx-auto mb-4 text-yellow-400" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Leaderboard</h2>
                <p className="text-gray-400">Compete with other German learners!</p>
            </div>

            {/* Timeframe Toggle */}
            <div className="flex justify-center gap-2 mb-8">
                {[
                    { id: 'weekly', label: 'This Week' },
                    { id: 'allTime', label: 'All Time' }
                ].map((tf) => (
                    <motion.button
                        key={tf.id}
                        onClick={() => setTimeframe(tf.id)}
                        className="px-6 py-2.5 rounded-xl font-medium"
                        style={{
                            background: timeframe === tf.id ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${timeframe === tf.id ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                            color: timeframe === tf.id ? '#FFD700' : '#94a3b8'
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {tf.label}
                    </motion.button>
                ))}
            </div>

            {/* Your Position Card */}
            <motion.div
                className="rounded-2xl p-6 mb-6 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(15, 23, 42, 1) 100%)',
                    border: '2px solid rgba(255, 215, 0, 0.3)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }} />

                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black"
                        style={{ background: 'rgba(255, 215, 0, 0.2)', color: '#FFD700' }}>
                        #{userPosition}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">Your Position</h3>
                        <p className="text-gray-400">{xp.toLocaleString()} XP</p>
                    </div>
                    <Sparkles className="text-yellow-400" />
                </div>
            </motion.div>

            {/* Top 3 Podium */}
            {sortedLeaderboard.length >= 3 && (
                <div className="flex justify-center items-end gap-4 mb-8">
                    {/* 2nd Place */}
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-2"
                            style={{ background: 'rgba(192, 192, 192, 0.2)', border: '2px solid #C0C0C0' }}>
                            {sortedLeaderboard[1]?.avatar || '👤'}
                        </div>
                        <p className="text-white font-semibold">{sortedLeaderboard[1]?.name}</p>
                        <p className="text-gray-400 text-sm">{sortedLeaderboard[1]?.xp?.toLocaleString()} XP</p>
                        <div className="w-20 h-24 rounded-t-xl mt-2 flex items-center justify-center"
                            style={{ background: 'linear-gradient(180deg, rgba(192, 192, 192, 0.3) 0%, rgba(192, 192, 192, 0.1) 100%)' }}>
                            <Medal size={32} style={{ color: '#C0C0C0' }} />
                        </div>
                    </motion.div>

                    {/* 1st Place */}
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Crown size={32} className="mx-auto mb-2 text-yellow-400" />
                        </motion.div>
                        <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl mx-auto mb-2"
                            style={{
                                background: 'rgba(255, 215, 0, 0.2)',
                                border: '3px solid #FFD700',
                                boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)'
                            }}>
                            {sortedLeaderboard[0]?.avatar || '👤'}
                        </div>
                        <p className="text-white font-bold text-lg">{sortedLeaderboard[0]?.name}</p>
                        <p className="text-yellow-400 font-semibold">{sortedLeaderboard[0]?.xp?.toLocaleString()} XP</p>
                        <div className="w-24 h-32 rounded-t-xl mt-2 flex items-center justify-center"
                            style={{ background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0.1) 100%)' }}>
                            <Trophy size={40} className="text-yellow-400" />
                        </div>
                    </motion.div>

                    {/* 3rd Place */}
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-2"
                            style={{ background: 'rgba(205, 127, 50, 0.2)', border: '2px solid #CD7F32' }}>
                            {sortedLeaderboard[2]?.avatar || '👤'}
                        </div>
                        <p className="text-white font-semibold">{sortedLeaderboard[2]?.name}</p>
                        <p className="text-gray-400 text-sm">{sortedLeaderboard[2]?.xp?.toLocaleString()} XP</p>
                        <div className="w-20 h-20 rounded-t-xl mt-2 flex items-center justify-center"
                            style={{ background: 'linear-gradient(180deg, rgba(205, 127, 50, 0.3) 0%, rgba(205, 127, 50, 0.1) 100%)' }}>
                            <Medal size={28} style={{ color: '#CD7F32' }} />
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Rest of Leaderboard */}
            <motion.div
                className="rounded-2xl overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 1) 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.1)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                {sortedLeaderboard.slice(3).map((player, index) => {
                    const position = index + 4;
                    const level = getCurrentLevel(player.xp);
                    const isCurrentUser = currentUser && player.id === currentUser.uid;

                    return (
                        <motion.div
                            key={player.id}
                            className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0"
                            style={{
                                background: isCurrentUser ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
                            }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ background: 'rgba(255, 255, 255, 0.03)' }}
                        >
                            <div className="w-8 text-center font-bold text-gray-500">
                                {position}
                            </div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                style={{ background: `${level.color}20` }}>
                                {player.avatar || '👤'}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-white">
                                    {player.name}
                                    {isCurrentUser && <span className="text-yellow-400 text-sm ml-2">(You)</span>}
                                </h4>
                                <div className="flex items-center gap-2 text-sm">
                                    <span style={{ color: level.color }}>{level.name}</span>
                                    {player.streak > 0 && (
                                        <span className="flex items-center gap-1 text-orange-400">
                                            <Flame size={12} />
                                            {player.streak}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-white">{player.xp?.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">XP</p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
