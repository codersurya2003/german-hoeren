import '@testing-library/jest-dom';

// Mock Web Speech API
window.speechSynthesis = {
    getVoices: () => [],
    speak: () => { },
    cancel: () => { },
    pause: () => { },
    resume: () => { },
    speaking: false,
    pending: false,
    paused: false,
};

window.SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
    constructor(text) {
        this.text = text;
    }
};

// Mock SpeechRecognition
window.SpeechRecognition = class SpeechRecognition {
    start() { }
    stop() { }
    abort() { }
};
window.webkitSpeechRecognition = window.SpeechRecognition;
