import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic, MicOff, Play, Pause, RotateCcw, Volume2,
    CheckCircle, XCircle, Sparkles, Target, TrendingUp,
    ChevronRight, ChevronLeft, Shuffle
} from 'lucide-react';
import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    Container,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    Progress,
    Text,
    VStack,
    Badge,
    useColorModeValue,
    Tooltip,
    Alert,
    AlertIcon,
    SimpleGrid,
    Divider
} from '@chakra-ui/react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTTS } from '../hooks/useTTS';
import { WORDS } from '../data/words';
import { useFirebaseProgress } from '../hooks/useFirebaseProgress';
import { useAuth } from '../contexts/AuthContext';

export function VoiceStudio() {
    // Use full word list for random practice
    const [currentWordIndex, setCurrentWordIndex] = useState(() =>
        Math.floor(Math.random() * WORDS.length)
    );
    const [difficulty, setDifficulty] = useState(1); // 1-5 difficulty levels
    const [showResult, setShowResult] = useState(false);
    const [isPlayingNative, setIsPlayingNative] = useState(false);
    const [pronunciationResult, setPronunciationResult] = useState(null);

    // Ref to track the latest transcript value (avoids stale closure issues)
    const transcriptRef = useRef('');

    // Difficulty levels configuration
    const difficultyLevels = [
        { level: 1, name: 'A1 Beginner', icon: '🌱', colorScheme: 'green', description: 'Single words' },
        { level: 2, name: 'A2 Elementary', icon: '🌿', colorScheme: 'whatsapp', description: 'Short phrases' },
        { level: 3, name: 'B1 Intermediate', icon: '🌳', colorScheme: 'yellow', description: 'Simple sentences' },
        { level: 4, name: 'B2 Advanced', icon: '🔥', colorScheme: 'orange', description: 'Complex sentences' },
        { level: 5, name: 'C1 Expert', icon: '⭐', colorScheme: 'red', description: 'Long sentences' }
    ];

    const currentDifficulty = difficultyLevels.find(d => d.level === difficulty);
    const currentWord = WORDS[currentWordIndex];

    // Get practice text based on difficulty
    const getPracticeText = () => {
        switch (difficulty) {
            case 1: return currentWord.german; // Single word
            case 2: return currentWord.phrase || currentWord.german; // Short phrase
            case 3: return currentWord.example.split('.')[0] + '.'; // First sentence
            case 4: return currentWord.example; // Full sentence
            case 5: return currentWord.example + ' ' + (currentWord.phrase ? `Das bedeutet: ${currentWord.phrase}.` : ''); // Extended
            default: return currentWord.german;
        }
    };
    const practiceText = getPracticeText();

    const {
        isRecording, audioUrl, duration, visualizerData,
        startRecording, stopRecording, clearRecording, error: recorderError
    } = useVoiceRecorder();

    const {
        isListening, transcript, interimTranscript, confidence,
        startListening, stopListening, resetTranscript, analyzePronunciation,
        isSupported: speechSupported
    } = useSpeechRecognition();

    const { speak } = useTTS();
    const audioRef = useRef(null);

    // Firebase progress tracking
    const { currentUser } = useAuth();
    const { addXp, updateStats, recordPractice } = useFirebaseProgress();

    // Keep transcriptRef synced with latest transcript value
    useEffect(() => {
        transcriptRef.current = transcript;
    }, [transcript]);

    const bg = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');

    // Handle recording with speech recognition
    const handleStartRecording = () => {
        clearRecording();
        resetTranscript();
        setShowResult(false);
        setPronunciationResult(null);
        transcriptRef.current = ''; // Reset ref as well
        startRecording();
        if (speechSupported) {
            startListening();
        }
    };

    const handleStopRecording = () => {
        stopRecording();
        stopListening();

        // Analyze pronunciation after a delay to allow final transcript to settle
        setTimeout(async () => {
            // Use ref to get the latest transcript value (avoids stale closure)
            const currentTranscript = transcriptRef.current;
            const result = analyzePronunciation(practiceText, currentTranscript);
            setPronunciationResult(result);
            setShowResult(true);

            // Save progress to Firebase
            if (currentUser && result) {
                const xpEarned = Math.round(result.overallScore / 10); // 0-10 XP based on score
                await addXp(xpEarned);
                await updateStats({ pronunciationSessions: 1 });
                await recordPractice();
            }
        }, 800);
    };

    // Play native pronunciation
    const handlePlayNative = () => {
        setIsPlayingNative(true);
        speak(practiceText);
        setTimeout(() => setIsPlayingNative(false), 2000);
    };

    // Reset state helper
    const resetState = useCallback(() => {
        clearRecording();
        resetTranscript();
        setShowResult(false);
        setPronunciationResult(null);
    }, [clearRecording, resetTranscript]);

    // Navigate words
    const nextWord = useCallback(() => {
        setCurrentWordIndex((prev) => (prev + 1) % WORDS.length);
        resetState();
    }, [resetState]);

    const prevWord = useCallback(() => {
        setCurrentWordIndex((prev) => (prev - 1 + WORDS.length) % WORDS.length);
        resetState();
    }, [resetState]);

    const shuffleWord = useCallback(() => {
        setCurrentWordIndex((prev) => {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * WORDS.length);
            } while (newIndex === prev && WORDS.length > 1);
            return newIndex;
        });
        resetState();
    }, [resetState]);

    const typeColorScheme = {
        'Noun (m)': 'blue',
        'Noun (f)': 'pink',
        'Noun (n)': 'green',
        'Verb': 'orange',
        'Adjective': 'purple',
        'Adverb': 'cyan',
        'default': 'yellow'
    };
    const accentScheme = typeColorScheme[currentWord?.type] || 'gray';

    return (
        <Container maxW="4xl" py={4}>
            {/* Difficulty Level Selector */}
            <Box mb={8} textAlign="center">
                <HStack justify="center" spacing={4} mb={4}>
                    <Text fontSize="2xl">{currentDifficulty.icon}</Text>
                    <Heading size="md" color={`${currentDifficulty.colorScheme}.500`}>
                        {currentDifficulty.name}
                    </Heading>
                </HStack>
                <Text color="gray.500" mb={6}>{currentDifficulty.description}</Text>

                <Flex justify="center" gap={2} wrap="wrap">
                    {difficultyLevels.map((d) => (
                        <Tooltip key={d.level} label={d.description} hasArrow>
                            <Button
                                size="sm"
                                variant={difficulty === d.level ? 'solid' : 'outline'}
                                colorScheme={d.colorScheme}
                                onClick={() => setDifficulty(d.level)}
                                borderRadius="full"
                                leftIcon={<Text>{d.icon}</Text>}
                            >
                                {d.name.split(' ')[0]}
                            </Button>
                        </Tooltip>
                    ))}
                </Flex>
            </Box>

            {/* Main Practice Card */}
            <Card
                variant="outline"
                size="lg"
                borderRadius="3xl"
                boxShadow="xl"
                bg={cardBg}
                overflow="hidden"
                mb={6}
            >
                <CardBody p={8} textAlign="center">
                    {/* Navigation Header */}
                    <Flex justify="space-between" align="center" mb={8}>
                        <IconButton
                            icon={<ChevronLeft />}
                            onClick={prevWord}
                            isRound
                            variant="ghost"
                            aria-label="Previous word"
                        />

                        <HStack>
                            <Badge colorScheme={accentScheme} px={3} py={1} borderRadius="full">
                                {currentWord?.type}
                            </Badge>
                            <IconButton
                                icon={<Shuffle size={16} />}
                                onClick={shuffleWord}
                                size="sm"
                                isRound
                                variant="ghost"
                                colorScheme={accentScheme}
                                aria-label="Shuffle word"
                            />
                        </HStack>

                        <IconButton
                            icon={<ChevronRight />}
                            onClick={nextWord}
                            isRound
                            variant="ghost"
                            aria-label="Next word"
                        />
                    </Flex>

                    {/* Practice Text */}
                    <VStack spacing={4} mb={8}>
                        <Heading
                            size={difficulty <= 2 ? '2xl' : 'lg'}
                            lineHeight="shorter"
                        >
                            {practiceText}
                        </Heading>
                        <Text fontSize="lg" color="gray.500">
                            {currentWord?.english}
                        </Text>
                    </VStack>

                    {/* Native Audio Button */}
                    <Button
                        leftIcon={<Icon as={Volume2} size={20} animation={isPlayingNative ? "pulse 2s infinite" : undefined} />}
                        onClick={handlePlayNative}
                        colorScheme={accentScheme}
                        variant={isPlayingNative ? 'solid' : 'outline'}
                        size="lg"
                        borderRadius="full"
                        mb={8}
                    >
                        Listen to Native
                    </Button>

                    {/* Visualizer */}
                    <Flex justify="center" align="center" h="60px" gap={1} mb={8}>
                        {visualizerData.map((value, index) => (
                            <Box
                                key={index}
                                w="6px"
                                borderRadius="full"
                                bg={`${accentScheme}.500`}
                                h={isRecording ? `${Math.max(8, value * 60)}px` : '4px'}
                                opacity={isRecording ? 0.6 + value * 0.4 : 0.2}
                                transition="all 0.05s ease"
                            />
                        ))}
                    </Flex>

                    {/* Recording Controls */}
                    <Flex justify="center" gap={4}>
                        {!isRecording ? (
                            <Button
                                leftIcon={<Mic />}
                                onClick={handleStartRecording}
                                colorScheme="red"
                                size="lg"
                                h="16"
                                px={8}
                                borderRadius="2xl"
                                boxShadow="lg"
                                _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                            >
                                Start Recording
                            </Button>
                        ) : (
                            <Button
                                leftIcon={<MicOff />}
                                onClick={handleStopRecording}
                                colorScheme="gray"
                                size="lg"
                                h="16"
                                px={8}
                                borderRadius="2xl"
                                animation="pulse 2s infinite"
                            >
                                Stop ({duration}s)
                            </Button>
                        )}
                    </Flex>

                    {/* Error display */}
                    {recorderError && (
                        <Alert status="error" mt={4} borderRadius="md">
                            <AlertIcon />
                            {recorderError}
                        </Alert>
                    )}

                    {/* Playback Audio (hidden) */}
                    {audioUrl && <audio ref={audioRef} src={audioUrl} style={{ display: 'none' }} />}
                </CardBody>
            </Card>

            {/* Results Panel */}
            <AnimatePresence>
                {showResult && pronunciationResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card variant="outline" borderRadius="2xl" overflow="hidden" borderColor={pronunciationResult.fluencyRating.color}>
                            <CardBody p={6}>
                                <VStack spacing={6}>
                                    <Box textAlign="center">
                                        <Heading size="3xl" color={pronunciationResult.fluencyRating.color}>
                                            {pronunciationResult.overallScore}%
                                        </Heading>
                                        <Text fontSize="xl" fontWeight="bold" mt={2}>
                                            {pronunciationResult.fluencyRating.emoji} {pronunciationResult.fluencyRating.label}
                                        </Text>
                                    </Box>

                                    <Box w="full" bg="gray.50" p={4} borderRadius="lg">
                                        <Text fontSize="sm" color="gray.500" mb={1}>We heard:</Text>
                                        <Text fontSize="lg" fontWeight="medium">
                                            {transcript || <Text as="span" fontStyle="italic" color="gray.400">No speech detected</Text>}
                                        </Text>
                                    </Box>

                                    {/* Playback controls */}
                                    {audioUrl && (
                                        <HStack>
                                            <Button leftIcon={<Play size={16} />} size="sm" onClick={() => audioRef.current?.play()}>
                                                Play Recording
                                            </Button>
                                            <Button leftIcon={<Volume2 size={16} />} size="sm" variant="ghost" onClick={handlePlayNative}>
                                                Compare Native
                                            </Button>
                                        </HStack>
                                    )}

                                    <Divider />

                                    {/* Word Analysis */}
                                    {pronunciationResult.wordScores?.length > 0 && (
                                        <Box w="full">
                                            <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={3} textTransform="uppercase">
                                                Word Analysis
                                            </Text>
                                            <Flex wrap="wrap" gap={2}>
                                                {pronunciationResult.wordScores.map((word, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        colorScheme={word.correct ? 'green' : 'red'}
                                                        variant="subtle"
                                                        px={2}
                                                        py={1}
                                                        borderRadius="md"
                                                        display="flex"
                                                        alignItems="center"
                                                        gap={1}
                                                    >
                                                        {word.correct ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                        {word.expected}
                                                    </Badge>
                                                ))}
                                            </Flex>
                                        </Box>
                                    )}

                                    {/* Tips */}
                                    <VStack w="full" align="stretch" spacing={3}>
                                        {pronunciationResult.tips.map((tip, idx) => (
                                            <Alert
                                                key={idx}
                                                status={tip.type === 'phoneme' ? 'info' : tip.type}
                                                variant="left-accent"
                                                borderRadius="md"
                                            >
                                                <AlertIcon />
                                                <Box>
                                                    {tip.type === 'phoneme' ? (
                                                        <Box>
                                                            <HStack mb={1}>
                                                                <Text fontWeight="bold">{tip.name}</Text>
                                                                <Badge>{tip.ipa}</Badge>
                                                            </HStack>
                                                            <Text fontSize="sm">{tip.text}</Text>
                                                        </Box>
                                                    ) : (
                                                        <Text fontSize="sm">{tip.text}</Text>
                                                    )}
                                                </Box>
                                            </Alert>
                                        ))}
                                    </VStack>
                                </VStack>
                            </CardBody>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {!speechSupported && (
                <Alert status="warning" mt={6} borderRadius="xl">
                    <AlertIcon />
                    Speech recognition is not supported in this browser. Try Chrome for the best experience.
                </Alert>
            )}
        </Container>
    );
}
