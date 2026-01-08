import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { achievements, xpRewards, getCurrentLevel } from '../data/gameData';

export function useFirebaseProgress() {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Listen to user data changes in real-time
    useEffect(() => {
        if (!currentUser) {
            setUserData(null);
            setLoading(false);
            return;
        }

        const userRef = doc(db, 'users', currentUser.uid);

        const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                setUserData(doc.data());
            } else {
                setUserData(null);
            }
            setLoading(false);
        }, (error) => {
            console.error('Error listening to user data:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Add XP
    const addXp = useCallback(async (amount) => {
        if (!currentUser) return;

        const userRef = doc(db, 'users', currentUser.uid);

        try {
            await updateDoc(userRef, {
                'progress.xp': increment(amount)
            });
        } catch (error) {
            console.error('Error adding XP:', error);
        }
    }, [currentUser]);

    // Record practice (update streak)
    const recordPractice = useCallback(async () => {
        if (!currentUser || !userData) return;

        const userRef = doc(db, 'users', currentUser.uid);
        const today = new Date().toDateString();
        const lastPractice = userData.progress?.lastPractice?.toDate?.()?.toDateString?.();

        if (lastPractice === today) {
            // Already practiced today
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutive = lastPractice === yesterday.toDateString();

        const newStreak = isConsecutive ? (userData.progress?.streak || 0) + 1 : 1;
        const streakBonus = xpRewards.streak_bonus * newStreak;

        try {
            await updateDoc(userRef, {
                'progress.streak': newStreak,
                'progress.lastPractice': serverTimestamp(),
                'progress.xp': increment(streakBonus)
            });
        } catch (error) {
            console.error('Error recording practice:', error);
        }
    }, [currentUser, userData]);

    // Unlock achievement
    const unlockAchievement = useCallback(async (achievementId) => {
        if (!currentUser || !userData) return null;

        const currentAchievements = userData.achievements || [];
        if (currentAchievements.includes(achievementId)) {
            return null; // Already unlocked
        }

        const achievement = achievements.find(a => a.id === achievementId);
        if (!achievement) return null;

        const userRef = doc(db, 'users', currentUser.uid);

        try {
            await updateDoc(userRef, {
                achievements: [...currentAchievements, achievementId],
                'progress.xp': increment(achievement.xpReward)
            });
            return achievement;
        } catch (error) {
            console.error('Error unlocking achievement:', error);
            return null;
        }
    }, [currentUser, userData]);

    // Update stats
    const updateStats = useCallback(async (statUpdates) => {
        if (!currentUser) return;

        const userRef = doc(db, 'users', currentUser.uid);
        const updates = {};

        Object.entries(statUpdates).forEach(([key, value]) => {
            updates[`stats.${key}`] = increment(value);
        });

        try {
            await updateDoc(userRef, updates);
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }, [currentUser]);

    // Update leaderboard
    const updateLeaderboard = useCallback(async () => {
        if (!currentUser || !userData) return;

        const weeklyRef = doc(db, 'leaderboard', 'weekly', 'users', currentUser.uid);
        const allTimeRef = doc(db, 'leaderboard', 'allTime', 'users', currentUser.uid);

        const leaderboardEntry = {
            name: userData.profile?.displayName || 'Anonymous',
            xp: userData.progress?.xp || 0,
            streak: userData.progress?.streak || 0,
            avatar: userData.profile?.photoURL || '👤',
            updatedAt: serverTimestamp()
        };

        try {
            await setDoc(weeklyRef, leaderboardEntry, { merge: true });
            await setDoc(allTimeRef, leaderboardEntry, { merge: true });
        } catch (error) {
            console.error('Error updating leaderboard:', error);
        }
    }, [currentUser, userData]);

    // Sync local progress to Firebase (for migration)
    const syncLocalProgress = useCallback(async () => {
        if (!currentUser) return;

        // Get local storage data
        const localXp = parseInt(localStorage.getItem('deutschhoren_xp') || '0', 10);
        const localStreak = parseInt(localStorage.getItem('deutschhoren_streak') || '0', 10);
        const localAchievements = JSON.parse(localStorage.getItem('deutschhoren_achievements') || '[]');
        const localStats = JSON.parse(localStorage.getItem('deutschhoren_stats') || '{}');

        if (localXp === 0 && localStreak === 0) return;

        const userRef = doc(db, 'users', currentUser.uid);

        try {
            // Only sync if Firebase data is empty or local is higher
            if (!userData?.progress?.xp || localXp > userData.progress.xp) {
                await updateDoc(userRef, {
                    'progress.xp': localXp,
                    'progress.streak': localStreak,
                    achievements: [...new Set([...(userData?.achievements || []), ...localAchievements])],
                    stats: { ...localStats }
                });

                // Clear local storage after sync
                localStorage.removeItem('deutschhoren_xp');
                localStorage.removeItem('deutschhoren_streak');
                localStorage.removeItem('deutschhoren_achievements');
                localStorage.removeItem('deutschhoren_stats');
            }
        } catch (error) {
            console.error('Error syncing local progress:', error);
        }
    }, [currentUser, userData]);

    // Derived values
    const xp = userData?.progress?.xp || 0;
    const streak = userData?.progress?.streak || 0;
    const stats = userData?.stats || {};
    const unlockedAchievements = userData?.achievements || [];
    const level = getCurrentLevel(xp);

    return {
        loading,
        userData,
        xp,
        streak,
        stats,
        unlockedAchievements,
        level,
        addXp,
        recordPractice,
        unlockAchievement,
        updateStats,
        updateLeaderboard,
        syncLocalProgress
    };
}
