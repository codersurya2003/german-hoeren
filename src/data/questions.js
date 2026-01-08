import { WORDS } from './words';

// Helper to get random items from an array
const getRandomItems = (array, count, excludeItem) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    const result = [];
    for (const item of shuffled) {
        if (item.id !== excludeItem.id) {
            result.push(item);
        }
        if (result.length >= count) break;
    }
    return result;
};

const getArticle = (word) => {
    if (word.german.startsWith("Der ")) return "der";
    if (word.german.startsWith("Die ")) return "die";
    if (word.german.startsWith("Das ")) return "das";
    return null;
};

export function generateQuestions(count = 10) {
    const questions = [];

    for (let i = 0; i < count; i++) {
        // Pick a random word
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];

        // Determine possible question types for this word
        const types = ['vocab', 'listening'];

        // Only nouns with articles can have grammar questions
        const article = getArticle(word);
        if (article) {
            types.push('grammar');
        }

        const type = types[Math.floor(Math.random() * types.length)];

        let q = {
            id: i,
            type: type,
            question: "",
            options: [],
            correct: "",
            explanation: "",
            textToSpeak: ""
        };

        if (type === 'vocab') {
            // German -> English
            q.question = `What does "${word.german}" mean?`;
            q.correct = word.english;

            // Distractors: other English definitions
            const distractors = getRandomItems(WORDS, 3, word).map(w => w.english);
            q.options = [...distractors, word.english].sort(() => 0.5 - Math.random());

            q.explanation = `"${word.german}" translates to "${word.english}". Example: ${word.example}`;

        } else if (type === 'listening') {
            // TTS -> Select German Word
            q.textToSpeak = word.german;
            q.question = "What word did you hear?";
            q.correct = word.german;

            // Distractors: other German words
            const distractors = getRandomItems(WORDS, 3, word).map(w => w.german);
            q.options = [...distractors, word.german].sort(() => 0.5 - Math.random());

            q.explanation = `You heard "${word.german}" (${word.english}).`;

        } else if (type === 'grammar') {
            // Guess Article
            const noun = word.german.split(" ")[1]; // "Der Apfel" -> "Apfel"
            q.question = `Which article fits? "___ ${noun}"`;
            q.correct = article;
            q.options = ["der", "die", "das", "den"]; // Fixed options for articles

            q.explanation = `"${word.german}" uses the article "${article}". (${word.type})`;
        }

        questions.push(q);
    }

    return questions;
}

// Keep the static export for now just in case, or we can remove it.
// Converting it to use the generator immediately to break dependency on static array if possible, 
// but existing code imports it directly. 
// Use a proxy or just export a generated batch.
export const EXAM_QUESTIONS = generateQuestions(5);
