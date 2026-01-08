import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useTTS } from '../hooks/useTTS';

export function WordCard({ word }) {
    const [showTranslation, setShowTranslation] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const { speak } = useTTS();

    const handleReveal = () => setShowTranslation(!showTranslation);

    const handlePlay = async (e) => {
        e.stopPropagation();
        setIsPlaying(true);
        try {
            await speak(word.german);
        } finally {
            setTimeout(() => setIsPlaying(false), 500);
        }
    };

    // Type color mapping
    const typeColors = {
        'Noun (m)': { accent: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
        'Noun (f)': { accent: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)' },
        'Noun (n)': { accent: '#22C55E', bg: 'rgba(34, 197, 94, 0.15)' },
        'Verb': { accent: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
        'Adjective': { accent: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)' },
        'Adverb': { accent: '#06B6D4', bg: 'rgba(6, 182, 212, 0.15)' },
        'default': { accent: '#FFD700', bg: 'rgba(255, 215, 0, 0.15)' }
    };

    const colors = typeColors[word.type] || typeColors['default'];

    return (
        <motion.div
            className="w-full cursor-pointer group"
            style={{ minHeight: '280px' }}
            onClick={handleReveal}
            variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 }
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div
                className="relative w-full h-full rounded-3xl overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 1) 100%)`,
                    border: `2px solid ${colors.accent}60`,
                    boxShadow: `
                        0 20px 40px -15px rgba(0, 0, 0, 0.5),
                        0 0 60px -20px ${colors.accent}50,
                        inset 0 1px 0 rgba(255, 255, 255, 0.15)
                    `
                }}
            >
                {/* Glowing top edge */}
                <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)` }}
                />

                {/* Content Container */}
                <div className="flex flex-col h-full p-6" style={{ minHeight: '280px' }}>
                    {/* Top Row: Type Badge & Sound Button */}
                    <div className="flex justify-between items-start">
                        <motion.span
                            className="text-xs uppercase tracking-widest font-bold px-3 py-1.5 rounded-full"
                            style={{
                                background: colors.bg,
                                color: colors.accent,
                                border: `1px solid ${colors.accent}40`
                            }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {word.type}
                        </motion.span>

                        <motion.button
                            onClick={handlePlay}
                            className="p-3 rounded-full transition-all duration-300"
                            style={{
                                background: isPlaying ? colors.accent : 'rgba(255, 255, 255, 0.1)',
                                color: isPlaying ? '#000' : '#fff',
                                border: `1px solid ${isPlaying ? colors.accent : 'rgba(255, 255, 255, 0.2)'}`,
                                boxShadow: isPlaying ? `0 0 20px ${colors.accent}60` : 'none'
                            }}
                            whileHover={{
                                scale: 1.1,
                                background: colors.accent,
                                color: '#000'
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Volume2 size={20} />
                        </motion.button>
                    </div>

                    {/* Center: German Word */}
                    <div className="flex-1 flex items-center justify-center py-6">
                        <motion.h3
                            className="text-4xl md:text-5xl font-bold text-center leading-tight"
                            style={{
                                color: '#ffffff',
                                textShadow: `0 0 40px ${colors.accent}40, 0 2px 4px rgba(0,0,0,0.3)`
                            }}
                        >
                            {word.german}
                        </motion.h3>
                    </div>

                    {/* Translation Section */}
                    <AnimatePresence mode="wait">
                        {showTranslation ? (
                            <motion.div
                                key="translation"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-center"
                            >
                                {/* Divider */}
                                <div
                                    className="w-16 h-0.5 rounded-full mx-auto mb-4"
                                    style={{ background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)` }}
                                />

                                {/* English Translation */}
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <Sparkles size={16} style={{ color: colors.accent }} />
                                    <h4 className="text-2xl font-semibold" style={{ color: colors.accent }}>
                                        {word.english}
                                    </h4>
                                </div>

                                {/* Example Sentence */}
                                <p className="italic text-sm px-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    "{word.example}"
                                </p>

                                {/* Hide hint */}
                                <motion.div
                                    className="flex items-center justify-center gap-2 mt-4 opacity-60"
                                    style={{ color: colors.accent }}
                                >
                                    <EyeOff size={12} />
                                    <span className="text-xs uppercase tracking-wider">Tap to hide</span>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="hint"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center gap-2 text-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ color: colors.accent }}
                            >
                                <Eye size={14} className="animate-pulse" />
                                <span className="uppercase tracking-widest text-xs font-medium">
                                    Tap to reveal
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
