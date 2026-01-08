import { useState, useCallback, useRef, useEffect } from 'react';

// German phoneme patterns and their pronunciation tips
const GERMAN_PHONEMES = {
    'ü': {
        pattern: /ü/gi,
        name: 'ü (Umlaut)',
        ipa: '/yː/',
        tip: 'Say "ee" but round your lips like saying "oo"',
        commonMistake: 'Saying "u" or "i" instead',
        examples: ['für', 'über', 'grün', 'Tür']
    },
    'ö': {
        pattern: /ö/gi,
        name: 'ö (Umlaut)',
        ipa: '/øː/',
        tip: 'Say "eh" but round your lips like saying "o"',
        commonMistake: 'Saying "o" or "e" instead',
        examples: ['schön', 'hören', 'möchten', 'Löffel']
    },
    'ä': {
        pattern: /ä/gi,
        name: 'ä (Umlaut)',
        ipa: '/ɛː/',
        tip: 'Like the "e" in "bed" but slightly longer',
        commonMistake: 'Saying "a" instead',
        examples: ['Mädchen', 'Käse', 'spät', 'wählen']
    },
    'ch_ich': {
        pattern: /ich|ech|üch|öch|äch|[^aou]ch/gi,
        name: 'ch (soft/ich-Laut)',
        ipa: '/ç/',
        tip: 'Like a soft "h" with your tongue near the roof of your mouth. Think of saying "hue"',
        commonMistake: 'Saying "sh" or hard "k" instead',
        examples: ['ich', 'mich', 'nicht', 'Mädchen']
    },
    'ch_ach': {
        pattern: /ach|och|uch/gi,
        name: 'ch (hard/ach-Laut)',
        ipa: '/x/',
        tip: 'A throaty sound, like clearing your throat gently',
        commonMistake: 'Saying "k" instead',
        examples: ['ach', 'Buch', 'noch', 'Nacht']
    },
    'sch': {
        pattern: /sch/gi,
        name: 'sch',
        ipa: '/ʃ/',
        tip: 'Like English "sh" but with more rounded lips',
        commonMistake: 'Not rounding lips enough',
        examples: ['schön', 'Schule', 'Tisch', 'waschen']
    },
    'sp_st': {
        pattern: /\b(sp|st)/gi,
        name: 'sp/st at word start',
        ipa: '/ʃp/, /ʃt/',
        tip: 'Pronounced as "shp" and "sht" at the beginning of words',
        commonMistake: 'Saying "sp" and "st" like in English',
        examples: ['sprechen', 'spielen', 'Straße', 'Stelle']
    },
    'z': {
        pattern: /z/gi,
        name: 'z',
        ipa: '/ts/',
        tip: 'Pronounced like "ts" in "cats"',
        commonMistake: 'Saying "z" like in English "zoo"',
        examples: ['Zeit', 'Zimmer', 'Zug', 'zehn']
    },
    'v': {
        pattern: /v/gi,
        name: 'v',
        ipa: '/f/',
        tip: 'Usually pronounced like "f" in German words',
        commonMistake: 'Saying "v" like in English',
        examples: ['Vater', 'verstehen', 'vier', 'viel']
    },
    'w': {
        pattern: /w/gi,
        name: 'w',
        ipa: '/v/',
        tip: 'Pronounced like English "v"',
        commonMistake: 'Saying "w" like in English',
        examples: ['was', 'wir', 'wann', 'Wasser']
    },
    'r': {
        pattern: /r/gi,
        name: 'r (uvular)',
        ipa: '/ʁ/',
        tip: 'A soft gargling sound from the back of the throat (uvular R)',
        commonMistake: 'Using English "r" sound',
        examples: ['rot', 'richtig', 'Frau', 'Brot']
    },
    'ei': {
        pattern: /ei/gi,
        name: 'ei',
        ipa: '/aɪ/',
        tip: 'Pronounced like "eye" in English',
        commonMistake: 'Saying "ee" instead',
        examples: ['mein', 'Wein', 'Zeit', 'nein']
    },
    'ie': {
        pattern: /ie/gi,
        name: 'ie',
        ipa: '/iː/',
        tip: 'Pronounced like a long "ee" sound',
        commonMistake: 'Confusing with "ei"',
        examples: ['die', 'wie', 'Liebe', 'spielen']
    },
    'eu_äu': {
        pattern: /eu|äu/gi,
        name: 'eu/äu',
        ipa: '/ɔɪ/',
        tip: 'Pronounced like "oy" in "boy"',
        commonMistake: 'Saying "e-u" separately',
        examples: ['heute', 'Freund', 'Häuser', 'träumen']
    },
    'ß': {
        pattern: /ß/gi,
        name: 'ß (Eszett)',
        ipa: '/s/',
        tip: 'A sharp "ss" sound, never voiced',
        commonMistake: 'Saying "b" or voiced "z"',
        examples: ['Straße', 'groß', 'heißen', 'weiß']
    }
};

export function useSpeechRecognition() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [confidence, setConfidence] = useState(0);
    const [error, setError] = useState(null);
    const [interimTranscript, setInterimTranscript] = useState('');

    const recognitionRef = useRef(null);

    const isSupported = typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    useEffect(() => {
        if (!isSupported) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'de-DE';

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';
            let maxConfidence = 0;

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    final += result[0].transcript;
                    maxConfidence = Math.max(maxConfidence, result[0].confidence);
                } else {
                    interim += result[0].transcript;
                }
            }

            if (final) {
                setTranscript(prev => (prev + ' ' + final).trim());
                setConfidence(maxConfidence);
            }
            setInterimTranscript(interim);
        };

        recognition.onerror = (event) => {
            if (event.error === 'not-allowed') {
                setError('Microphone access denied. Please allow microphone access.');
            } else if (event.error === 'no-speech') {
                // Ignore no-speech errors
            } else {
                setError(`Speech recognition error: ${event.error}`);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.abort();
        };
    }, [isSupported]);

    const startListening = useCallback(() => {
        if (!recognitionRef.current) return;

        setError(null);
        setTranscript('');
        setInterimTranscript('');
        setConfidence(0);

        try {
            recognitionRef.current.start();
            setIsListening(true);
        } catch (err) {
            console.error('Speech recognition start error:', err);
        }
    }, []);

    const stopListening = useCallback(() => {
        if (!recognitionRef.current) return;

        recognitionRef.current.stop();
        setIsListening(false);
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setInterimTranscript('');
        setConfidence(0);
    }, []);

    // Detect German phonemes in text
    const detectPhonemes = useCallback((text) => {
        const found = [];
        for (const [key, phoneme] of Object.entries(GERMAN_PHONEMES)) {
            if (phoneme.pattern.test(text)) {
                found.push({ id: key, ...phoneme });
            }
        }
        return found;
    }, []);

    // Enhanced pronunciation analysis
    const analyzePronunciation = useCallback((expectedText, spokenText) => {
        if (!expectedText) return null;

        const expected = expectedText.toLowerCase().trim();
        const spoken = (spokenText || '').toLowerCase().trim();

        // Word-by-word comparison
        const expectedWords = expected.split(/\s+/);
        const spokenWords = spoken.split(/\s+/);

        let matchedWords = 0;
        const wordScores = [];

        expectedWords.forEach((word, index) => {
            const spokenWord = spokenWords[index] || '';
            const similarity = calculateSimilarity(word, spokenWord);
            const phonemes = detectPhonemes(word);

            wordScores.push({
                expected: word,
                spoken: spokenWord,
                score: similarity,
                correct: similarity > 0.8,
                phonemes: phonemes
            });

            if (similarity > 0.7) matchedWords++;
        });

        const overallScore = expectedWords.length > 0
            ? Math.round((matchedWords / expectedWords.length) * 100)
            : 0;

        // Detect all phonemes in the expected text
        const allPhonemes = detectPhonemes(expected);

        // Generate enhanced tips
        const tips = generateEnhancedTips(wordScores, allPhonemes, spoken);

        return {
            overallScore,
            wordScores,
            phonemes: allPhonemes,
            fluencyRating: getFluencyRating(overallScore),
            tips,
            confidence: Math.round((confidence || 0) * 100)
        };
    }, [confidence, detectPhonemes]);

    return {
        isListening,
        isSupported,
        transcript,
        interimTranscript,
        confidence,
        error,
        startListening,
        stopListening,
        resetTranscript,
        analyzePronunciation,
        detectPhonemes
    };
}

// Levenshtein distance-based similarity
function calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    if (str1 === str2) return 1;

    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    const maxLen = Math.max(len1, len2);
    return 1 - (matrix[len1][len2] / maxLen);
}

function getFluencyRating(score) {
    if (score >= 90) return { label: 'Ausgezeichnet!', emoji: '🌟', color: '#22C55E' };
    if (score >= 75) return { label: 'Sehr Gut!', emoji: '✨', color: '#3B82F6' };
    if (score >= 60) return { label: 'Gut!', emoji: '👍', color: '#F59E0B' };
    if (score >= 40) return { label: 'Weiter üben!', emoji: '💪', color: '#F97316' };
    return { label: 'Versuch es nochmal!', emoji: '🔄', color: '#EF4444' };
}

function generateEnhancedTips(wordScores, phonemes, spoken) {
    const tips = [];
    const problematicWords = wordScores.filter(w => !w.correct);

    // No speech detected
    if (!spoken) {
        tips.push({
            type: 'error',
            icon: '🎤',
            text: 'No speech detected. Make sure your microphone is working and speak clearly.',
            priority: 1
        });
        return tips;
    }

    // Perfect score
    if (problematicWords.length === 0) {
        tips.push({
            type: 'success',
            icon: '🎉',
            text: 'Perfect pronunciation! Ausgezeichnet!',
            priority: 1
        });
    } else {
        // Add specific word tips
        problematicWords.slice(0, 2).forEach(word => {
            tips.push({
                type: 'correction',
                icon: '🔄',
                text: `"${word.expected}" → you said "${word.spoken || '(nothing)'}"`,
                expected: word.expected,
                spoken: word.spoken,
                priority: 2
            });
        });
    }

    // Add phoneme-specific tips for challenging sounds
    const challengingPhonemes = ['ü', 'ö', 'ä', 'ch_ich', 'ch_ach', 'r'];
    phonemes.forEach(phoneme => {
        if (challengingPhonemes.includes(phoneme.id)) {
            tips.push({
                type: 'phoneme',
                icon: '💡',
                phonemeId: phoneme.id,
                name: phoneme.name,
                ipa: phoneme.ipa,
                text: phoneme.tip,
                commonMistake: phoneme.commonMistake,
                examples: phoneme.examples,
                priority: 3
            });
        }
    });

    // Sort by priority
    tips.sort((a, b) => a.priority - b.priority);

    return tips;
}

// Export phonemes for use in other components
export { GERMAN_PHONEMES };
