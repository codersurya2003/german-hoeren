// Speaking partner profiles (simulated)
export const speakingPartners = [
    {
        id: 1,
        name: 'Anna Schmidt',
        avatar: '👩‍🦰',
        nativeLanguage: 'German',
        learningLanguage: 'English',
        level: 'Native Speaker',
        interests: ['Travel', 'Music', 'Cooking'],
        availability: 'Evenings (CET)',
        bio: 'Hi! I love helping people learn German. I work as a teacher in Berlin.',
        rating: 4.9,
        sessionsCompleted: 127,
        online: true
    },
    {
        id: 2,
        name: 'Markus Weber',
        avatar: '👨‍💼',
        nativeLanguage: 'German',
        learningLanguage: 'Spanish',
        level: 'Native Speaker',
        interests: ['Technology', 'Sports', 'Movies'],
        availability: 'Weekends',
        bio: 'Software developer from Munich. Happy to chat about tech in German!',
        rating: 4.7,
        sessionsCompleted: 89,
        online: false
    },
    {
        id: 3,
        name: 'Lisa Müller',
        avatar: '👩‍🎓',
        nativeLanguage: 'German',
        learningLanguage: 'French',
        level: 'Native Speaker',
        interests: ['Art', 'Literature', 'Coffee'],
        availability: 'Mornings (CET)',
        bio: 'University student in Hamburg. Love discussing books and culture!',
        rating: 4.8,
        sessionsCompleted: 64,
        online: true
    },
    {
        id: 4,
        name: 'Thomas Braun',
        avatar: '🧔',
        nativeLanguage: 'German',
        learningLanguage: 'Japanese',
        level: 'Native Speaker',
        interests: ['Gaming', 'Anime', 'Cooking'],
        availability: 'Flexible',
        bio: 'Freelance translator. Patient and encouraging teacher!',
        rating: 5.0,
        sessionsCompleted: 215,
        online: true
    },
    {
        id: 5,
        name: 'Julia Fischer',
        avatar: '👩‍🔬',
        nativeLanguage: 'German',
        learningLanguage: 'Korean',
        level: 'Native Speaker',
        interests: ['Science', 'K-pop', 'Hiking'],
        availability: 'Evenings & Weekends',
        bio: 'Research scientist in Frankfurt. Love teaching technical German!',
        rating: 4.6,
        sessionsCompleted: 42,
        online: false
    }
];

// Chat rooms / Practice topics
export const chatRooms = [
    {
        id: 'beginner_cafe',
        name: 'Beginner Café',
        description: 'Perfect for newcomers. Slow-paced, supportive conversations.',
        icon: '☕',
        level: 'A1-A2',
        activeUsers: 12,
        color: '#22C55E'
    },
    {
        id: 'daily_chat',
        name: 'Daily German',
        description: 'Practice everyday conversations and small talk.',
        icon: '💬',
        level: 'A2-B1',
        activeUsers: 28,
        color: '#3B82F6'
    },
    {
        id: 'travel_german',
        name: 'Travel German',
        description: 'Learn essential phrases for traveling in Germany.',
        icon: '✈️',
        level: 'A2-B1',
        activeUsers: 15,
        color: '#F59E0B'
    },
    {
        id: 'business_german',
        name: 'Business German',
        description: 'Professional vocabulary and formal expressions.',
        icon: '💼',
        level: 'B1-B2',
        activeUsers: 8,
        color: '#8B5CF6'
    },
    {
        id: 'news_discussion',
        name: 'News & Current Events',
        description: 'Discuss current events in German.',
        icon: '📰',
        level: 'B2-C1',
        activeUsers: 6,
        color: '#EC4899'
    },
    {
        id: 'culture_corner',
        name: 'Culture Corner',
        description: 'German traditions, holidays, and customs.',
        icon: '🏰',
        level: 'All Levels',
        activeUsers: 19,
        color: '#EF4444'
    }
];

// Conversation prompts for practice sessions
export const conversationPrompts = {
    beginner: [
        {
            topic: 'Introductions',
            prompt: 'Stell dich vor! (Introduce yourself!)',
            hints: ['Wie heißt du?', 'Woher kommst du?', 'Was machst du?'],
            vocabulary: ['heißen', 'kommen aus', 'wohnen in']
        },
        {
            topic: 'Daily Routine',
            prompt: 'Was machst du jeden Tag? (What do you do every day?)',
            hints: ['Um wie viel Uhr wachst du auf?', 'Was isst du zum Frühstück?'],
            vocabulary: ['aufwachen', 'frühstücken', 'arbeiten']
        },
        {
            topic: 'Hobbies',
            prompt: 'Was sind deine Hobbys? (What are your hobbies?)',
            hints: ['Sport machen', 'Musik hören', 'Bücher lesen'],
            vocabulary: ['spielen', 'lesen', 'kochen']
        }
    ],
    intermediate: [
        {
            topic: 'Travel Experience',
            prompt: 'Erzähl von deiner letzten Reise! (Tell about your last trip!)',
            hints: ['Wohin bist du gereist?', 'Wie lange warst du dort?'],
            vocabulary: ['reisen', 'besichtigen', 'erleben']
        },
        {
            topic: 'Opinions',
            prompt: 'Was denkst du über...? (What do you think about...?)',
            hints: ['Ich finde, dass...', 'Meiner Meinung nach...'],
            vocabulary: ['glauben', 'meinen', 'finden']
        },
        {
            topic: 'Future Plans',
            prompt: 'Was planst du für die Zukunft? (What are your future plans?)',
            hints: ['Nächstes Jahr werde ich...', 'Ich möchte...'],
            vocabulary: ['werden', 'planen', 'vorhaben']
        }
    ],
    advanced: [
        {
            topic: 'Debate',
            prompt: 'Diskutiere: Sollte man immer ehrlich sein?',
            hints: ['Einerseits...', 'Andererseits...', 'Im Großen und Ganzen...'],
            vocabulary: ['argumentieren', 'kritisieren', 'befürworten']
        },
        {
            topic: 'Hypotheticals',
            prompt: 'Wenn du alles ändern könntest, was würdest du tun?',
            hints: ['Wenn ich könnte...', 'Hätte ich die Möglichkeit...'],
            vocabulary: ['würden', 'könnten', 'sollten']
        }
    ]
};

// Session types
export const sessionTypes = [
    {
        id: 'free_conversation',
        name: 'Free Conversation',
        description: 'Open-ended chat on any topic',
        duration: '15-30 min',
        icon: '🗣️'
    },
    {
        id: 'guided_practice',
        name: 'Guided Practice',
        description: 'Structured conversation with prompts',
        duration: '20 min',
        icon: '📋'
    },
    {
        id: 'role_play',
        name: 'Role Play',
        description: 'Practice real-life scenarios',
        duration: '15 min',
        icon: '🎭'
    },
    {
        id: 'pronunciation_help',
        name: 'Pronunciation Help',
        description: 'Focus on accent and clarity',
        duration: '10 min',
        icon: '🎤'
    }
];
