import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn('Gemini API key not found. AI features will not work.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// System prompt for German learning assistance
const SYSTEM_PROMPT = `You are a helpful German language learning assistant. Your role is to:

1. Explain German grammar rules clearly and concisely
2. Provide accurate translations between English and German
3. Offer pronunciation guidance
4. Share common phrases and their usage
5. Answer questions about German culture when relevant

When answering:
- Be encouraging and supportive
- Use simple, clear explanations
- Provide examples in German with translations
- Format German text for easy reading
- Keep responses concise (2-3 paragraphs max)

If asked about something non-German related, politely redirect to German learning topics.`;

/**
 * Send a message to Gemini AI and get a response
 * @param {string} userMessage - The user's question
 * @param {Array} conversationHistory - Previous messages for context (optional)
 * @returns {Promise<{text: string, germanExample: string|null}>}
 */
export async function askGemini(userMessage, conversationHistory = []) {
    if (!genAI) {
        throw new Error('Gemini AI is not configured. Please add VITE_GEMINI_API_KEY to your environment variables.');
    }

    try {
        // Use gemini-2.0-flash (stable, free tier) - note the different naming format
        const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });

        // Build the prompt with context
        let fullPrompt = SYSTEM_PROMPT + '\n\n';

        // Add conversation history
        if (conversationHistory.length > 0) {
            fullPrompt += 'Previous conversation:\n';
            conversationHistory.slice(-4).forEach(msg => {
                fullPrompt += `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.text}\n`;
            });
            fullPrompt += '\n';
        }

        fullPrompt += `User: ${userMessage}\n\nAssistant:`;

        // Generate response
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // Try to extract German example from the response
        const germanExample = extractGermanExample(text);

        return {
            text,
            germanExample
        };
    } catch (error) {
        console.error('Gemini AI Error:', error);

        if (error.message?.includes('API key')) {
            throw new Error('Invalid API key. Please check your Gemini API key.');
        }
        if (error.message?.includes('quota')) {
            throw new Error('API quota exceeded. Please try again later.');
        }

        throw new Error('Failed to get AI response. Please try again.');
    }
}

/**
 * Extract a German phrase from the AI response for TTS
 * @param {string} text - The AI response text
 * @returns {string|null} - Extracted German phrase or null
 */
function extractGermanExample(text) {
    // Try to find text between quotes or asterisks
    const patterns = [
        /"([^"]+)"/g,           // Text in quotes
        /\*\*([^*]+)\*\*/g,     // Text in bold
        /`([^`]+)`/g,           // Text in code blocks
    ];

    for (const pattern of patterns) {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
            const phrase = match[1].trim();
            // Check if it looks like German (has umlauts or German words)
            if (/[äöüÄÖÜß]/.test(phrase) || /\b(ich|du|er|sie|es|der|die|das|ist|sind)\b/i.test(phrase)) {
                return phrase;
            }
        }
    }

    return null;
}

/**
 * Check if Gemini AI is configured
 * @returns {boolean}
 */
export function isGeminiConfigured() {
    return genAI !== null;
}
