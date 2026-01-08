// Achievements configuration
export const achievements = [
    {
        id: 'first_word',
        name: 'First Steps',
        description: 'Learn your first German word',
        icon: '🌱',
        xpReward: 10,
        requirement: { type: 'words_learned', count: 1 }
    },
    {
        id: 'word_collector_10',
        name: 'Word Collector',
        description: 'Learn 10 German words',
        icon: '📚',
        xpReward: 50,
        requirement: { type: 'words_learned', count: 10 }
    },
    {
        id: 'word_master_50',
        name: 'Vocabulary Builder',
        description: 'Learn 50 German words',
        icon: '🎓',
        xpReward: 200,
        requirement: { type: 'words_learned', count: 50 }
    },
    {
        id: 'streak_3',
        name: 'Getting Started',
        description: 'Practice 3 days in a row',
        icon: '🔥',
        xpReward: 30,
        requirement: { type: 'streak', count: 3 }
    },
    {
        id: 'streak_7',
        name: 'Week Warrior',
        description: 'Practice 7 days in a row',
        icon: '⚡',
        xpReward: 100,
        requirement: { type: 'streak', count: 7 }
    },
    {
        id: 'streak_30',
        name: 'Monthly Master',
        description: 'Practice 30 days in a row',
        icon: '👑',
        xpReward: 500,
        requirement: { type: 'streak', count: 30 }
    },
    {
        id: 'perfect_pronunciation',
        name: 'Native Speaker',
        description: 'Get 100% on pronunciation',
        icon: '🎤',
        xpReward: 75,
        requirement: { type: 'pronunciation_score', count: 100 }
    },
    {
        id: 'exam_ace',
        name: 'Exam Ace',
        description: 'Score 100% on a listening exam',
        icon: '🎧',
        xpReward: 100,
        requirement: { type: 'exam_score', count: 100 }
    },
    {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Complete 5 speaking sessions',
        icon: '🦋',
        xpReward: 150,
        requirement: { type: 'speaking_sessions', count: 5 }
    },
    {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Practice after midnight',
        icon: '🦉',
        xpReward: 25,
        requirement: { type: 'time_practice', condition: 'after_midnight' }
    },
    {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Practice before 7 AM',
        icon: '🐦',
        xpReward: 25,
        requirement: { type: 'time_practice', condition: 'before_7am' }
    },
    {
        id: 'challenge_champion',
        name: 'Challenge Champion',
        description: 'Complete 10 daily challenges',
        icon: '🏆',
        xpReward: 200,
        requirement: { type: 'challenges_completed', count: 10 }
    }
];

// XP rewards for various activities
export const xpRewards = {
    word_learned: 5,
    word_reviewed: 2,
    exam_completed: 20,
    exam_perfect: 50,
    pronunciation_practice: 10,
    pronunciation_perfect: 30,
    speaking_session: 25,
    daily_challenge: 15,
    streak_bonus: 5  // Per day of streak
};

// Level thresholds
export const levels = [
    { level: 1, name: 'Anfänger', minXp: 0, maxXp: 100, color: '#94A3B8' },
    { level: 2, name: 'Lernender', minXp: 100, maxXp: 250, color: '#3B82F6' },
    { level: 3, name: 'Fortgeschritten', minXp: 250, maxXp: 500, color: '#22C55E' },
    { level: 4, name: 'Erfahren', minXp: 500, maxXp: 1000, color: '#F59E0B' },
    { level: 5, name: 'Experte', minXp: 1000, maxXp: 2000, color: '#EC4899' },
    { level: 6, name: 'Meister', minXp: 2000, maxXp: 5000, color: '#8B5CF6' },
    { level: 7, name: 'Großmeister', minXp: 5000, maxXp: 10000, color: '#EF4444' },
    { level: 8, name: 'Legende', minXp: 10000, maxXp: Infinity, color: '#FFD700' }
];

// Daily challenges templates
export const challengeTemplates = [
    {
        id: 'tongue_twister',
        type: 'speaking',
        name: 'Zungenbrecher',
        description: 'Master this German tongue twister',
        icon: '👅',
        phrases: [
            'Fischers Fritz fischt frische Fische',
            'Blaukraut bleibt Blaukraut und Brautkleid bleibt Brautkleid',
            'Zehn zahme Ziegen zogen zehn Zentner Zucker zum Zoo',
            'Zwischen zwei Zwetschgenzweigen sitzen zwei zwitschernde Schwalben',
            'Der Cottbuser Postkutscher putzt den Cottbuser Postkutschkasten'
        ]
    },
    {
        id: 'speed_round',
        type: 'vocabulary',
        name: 'Speed Round',
        description: 'Answer as many as you can in 60 seconds',
        icon: '⚡',
        timeLimit: 60
    },
    {
        id: 'listening_challenge',
        type: 'listening',
        name: 'Ears Wide Open',
        description: 'Identify words from audio only',
        icon: '👂',
        wordCount: 10
    },
    {
        id: 'story_time',
        type: 'speaking',
        name: 'Story Time',
        description: 'Describe your day in German',
        icon: '📖',
        prompts: [
            'Was hast du heute gemacht?',
            'Beschreibe dein Lieblingsessen',
            'Erzähle von deiner Familie',
            'Was sind deine Hobbys?'
        ]
    }
];

// Helper function to get current level
export function getCurrentLevel(xp) {
    for (let i = levels.length - 1; i >= 0; i--) {
        if (xp >= levels[i].minXp) {
            return levels[i];
        }
    }
    return levels[0];
}

// Helper function to get level progress percentage
export function getLevelProgress(xp) {
    const level = getCurrentLevel(xp);
    const nextLevel = levels.find(l => l.level === level.level + 1);

    if (!nextLevel) return 100;

    const levelXp = xp - level.minXp;
    const levelRange = nextLevel.minXp - level.minXp;

    return Math.round((levelXp / levelRange) * 100);
}

// Sample leaderboard data
export const sampleLeaderboard = [
    { id: 1, name: 'Hans M.', xp: 2450, streak: 15, avatar: '👨‍🎓' },
    { id: 2, name: 'Sophie K.', xp: 2100, streak: 12, avatar: '👩‍💼' },
    { id: 3, name: 'Max B.', xp: 1890, streak: 8, avatar: '🧑‍💻' },
    { id: 4, name: 'Emma L.', xp: 1650, streak: 21, avatar: '👩‍🎨' },
    { id: 5, name: 'Felix R.', xp: 1420, streak: 5, avatar: '👨‍🔬' },
    { id: 6, name: 'Anna S.', xp: 1200, streak: 10, avatar: '👩‍🏫' },
    { id: 7, name: 'Lukas W.', xp: 980, streak: 7, avatar: '🧑‍🎤' },
    { id: 8, name: 'Mia H.', xp: 850, streak: 4, avatar: '👩‍🚀' },
    { id: 9, name: 'Noah F.', xp: 720, streak: 3, avatar: '👨‍🍳' },
    { id: 10, name: 'Lena P.', xp: 650, streak: 6, avatar: '👩‍⚕️' }
];
