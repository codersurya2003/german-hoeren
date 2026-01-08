import { useCallback, useEffect, useState } from 'react';

export function useTTS() {
    const [voices, setVoices] = useState([]);
    const [germanVoice, setGermanVoice] = useState(null);

    useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices();
            setVoices(available);

            // Try to find a German voice
            // Prioritize Google Deutsch or Microsoft Stefan/Hedda if available, else first de-* match
            const de = available.find(v => v.lang.startsWith('de')) || null;
            setGermanVoice(de);
        };

        loadVoices();

        // Chrome requires this event listener as voices load async
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    const speak = useCallback((text) => {
        if (!text) return;

        // Cancel any current speaking
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        if (germanVoice) {
            utterance.voice = germanVoice;
        }
        // Explicitly set lang just in case voice isn't perfect matches
        utterance.lang = 'de-DE';

        // Adjust rate/pitch for clarity
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        window.speechSynthesis.speak(utterance);
    }, [germanVoice]);

    return { speak, hasVoice: !!germanVoice };
}
