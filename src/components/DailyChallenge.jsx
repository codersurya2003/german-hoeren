import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Timer, Trophy, Mic, Volume2, RefreshCw,
    Check, X, ChevronRight, Star, Flame
} from 'lucide-react';
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Text,
    VStack,
    HStack,
    Icon,
    Badge,
    Card,
    CardBody,
    SimpleGrid,
    Progress,
    useColorModeValue,
    IconButton,
    Tooltip
} from '@chakra-ui/react';
import { challengeTemplates, xpRewards } from '../data/gameData';
import { getDailyWords } from '../data/words';
import { useTTS } from '../hooks/useTTS';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { useFirebaseProgress } from '../hooks/useFirebaseProgress';
import { useAuth } from '../contexts/AuthContext';

export function DailyChallenge() {
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [challengeState, setChallengeState] = useState('intro'); // 'intro', 'active', 'completed'
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [tonguePhrase, setTonguePhrase] = useState('');
    const [speedRoundAnswers, setSpeedRoundAnswers] = useState([]);
    const [currentSpeedQuestion, setCurrentSpeedQuestion] = useState(0);

    const { speak } = useTTS();
    const { isRecording, startRecording, stopRecording, audioUrl } = useVoiceRecorder();
    const dailyWords = getDailyWords();

    // Firebase progress tracking
    const { currentUser } = useAuth();
    const { addXp, updateStats, recordPractice } = useFirebaseProgress();
    const [progressSaved, setProgressSaved] = useState(false);

    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    // Get today's challenge (based on day of week)
    useEffect(() => {
        const dayIndex = new Date().getDay();
        const challenge = challengeTemplates[dayIndex % challengeTemplates.length];
        setCurrentChallenge(challenge);

        if (challenge.id === 'tongue_twister') {
            const phrases = challenge.phrases;
            setTonguePhrase(phrases[Math.floor(Math.random() * phrases.length)]);
        }
    }, []);

    // Timer for speed round
    useEffect(() => {
        let interval;
        if (challengeState === 'active' && currentChallenge?.id === 'speed_round' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setChallengeState('completed');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [challengeState, currentChallenge, timeLeft]);

    // Generate speed round questions
    const generateSpeedQuestions = useCallback(() => {
        const questions = dailyWords.map(word => ({
            german: word.german,
            english: word.english,
            options: shuffleArray([
                word.english,
                ...dailyWords
                    .filter(w => w.id !== word.id)
                    .slice(0, 3)
                    .map(w => w.english)
            ])
        }));
        return shuffleArray(questions);
    }, [dailyWords]);

    const startChallenge = () => {
        setChallengeState('active');
        setScore(0);

        if (currentChallenge?.id === 'speed_round') {
            setTimeLeft(currentChallenge.timeLimit || 60);
            setSpeedRoundAnswers(generateSpeedQuestions());
            setCurrentSpeedQuestion(0);
        }
    };

    const handleSpeedAnswer = (answer, correctAnswer) => {
        if (answer === correctAnswer) {
            setScore(prev => prev + 10);
        }

        if (currentSpeedQuestion < speedRoundAnswers.length - 1) {
            setCurrentSpeedQuestion(prev => prev + 1);
        } else {
            setChallengeState('completed');
        }
    };

    const resetChallenge = () => {
        setChallengeState('intro');
        setScore(0);
        setTimeLeft(0);
        setCurrentSpeedQuestion(0);
        setProgressSaved(false);
    };

    // Save progress when challenge is completed
    useEffect(() => {
        const saveProgress = async () => {
            if (challengeState === 'completed' && !progressSaved && currentUser && score > 0) {
                setProgressSaved(true);
                await addXp(score);
                await updateStats({ wordsLearned: Math.ceil(score / 10) });
                await recordPractice();
            }
        };
        saveProgress();
    }, [challengeState, progressSaved, currentUser, score, addXp, updateStats, recordPractice]);

    if (!currentChallenge) return null;

    const challengeColors = {
        'tongue_twister': 'pink',
        'speed_round': 'orange',
        'listening_challenge': 'blue',
        'story_time': 'green'
    };

    const colorScheme = challengeColors[currentChallenge.id] || 'yellow';
    const accentColor = `${colorScheme}.400`;

    return (
        <Container maxW="container.md" py={6}>
            {/* Challenge Header */}
            <VStack mb={8} as={motion.div} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <Badge
                    colorScheme={colorScheme}
                    variant="subtle"
                    px={4}
                    py={1.5}
                    borderRadius="full"
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    as={motion.div}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <Icon as={Zap} /> Daily Challenge
                </Badge>
            </VStack>

            {/* Challenge Card */}
            <Card
                bg={bg}
                borderRadius="3xl"
                overflow="hidden"
                boxShadow="xl"
                borderWidth="2px"
                borderColor={`${colorScheme}.100`}
                position="relative"
                as={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                {/* Top glow bar */}
                <Box position="absolute" top={0} left={0} right={0} h={1} bgGradient={`linear(to-r, transparent, ${colorScheme}.400, transparent)`} />

                <CardBody p={8}>
                    <AnimatePresence mode="wait">
                        {/* Intro State */}
                        {challengeState === 'intro' && (
                            <VStack
                                key="intro"
                                spacing={6}
                                textAlign="center"
                                as={motion.div}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <Box fontSize="6xl">{currentChallenge.icon}</Box>
                                <Box>
                                    <Heading size="lg" mb={2}>{currentChallenge.name}</Heading>
                                    <Text color="gray.500" fontSize="lg">{currentChallenge.description}</Text>
                                </Box>

                                {/* Challenge-specific info */}
                                {currentChallenge.id === 'tongue_twister' && (
                                    <Box
                                        p={6}
                                        borderRadius="2xl"
                                        bg={useColorModeValue('gray.50', 'whiteAlpha.100')}
                                        w="full"
                                    >
                                        <Text fontSize="2xl" fontWeight="medium" fontStyle="italic" mb={4}>
                                            "{tonguePhrase}"
                                        </Text>
                                        <Button
                                            leftIcon={<Icon as={Volume2} />}
                                            onClick={() => speak(tonguePhrase)}
                                            size="sm"
                                            colorScheme={colorScheme}
                                            variant="ghost"
                                        >
                                            Listen First
                                        </Button>
                                    </Box>
                                )}

                                {currentChallenge.id === 'speed_round' && (
                                    <HStack spacing={6} justify="center">
                                        <VStack>
                                            <Icon as={Timer} boxSize={8} color={`${colorScheme}.400`} />
                                            <Text fontSize="2xl" fontWeight="bold">{currentChallenge.timeLimit}s</Text>
                                            <Text fontSize="xs" color="gray.500">Time Limit</Text>
                                        </VStack>
                                        <VStack>
                                            <Icon as={Star} boxSize={8} color={`${colorScheme}.400`} />
                                            <Text fontSize="2xl" fontWeight="bold">10</Text>
                                            <Text fontSize="xs" color="gray.500">Points Each</Text>
                                        </VStack>
                                    </HStack>
                                )}

                                <Button
                                    size="lg"
                                    colorScheme={colorScheme}
                                    px={10}
                                    py={8}
                                    fontSize="xl"
                                    borderRadius="2xl"
                                    onClick={startChallenge}
                                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                                    transition="all 0.2s"
                                >
                                    Start Challenge
                                </Button>
                            </VStack>
                        )}

                        {/* Active State - Speed Round */}
                        {challengeState === 'active' && currentChallenge.id === 'speed_round' && (
                            <Box
                                key="speed-active"
                                as={motion.div}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {/* Timer & Score */}
                                <Flex justify="space-between" align="center" mb={8}>
                                    <HStack>
                                        <Icon as={Timer} color={timeLeft <= 10 ? 'red.500' : `${colorScheme}.500`} />
                                        <Text
                                            fontSize="3xl"
                                            fontWeight="bold"
                                            color={timeLeft <= 10 ? 'red.500' : 'inherit'}
                                            animation={timeLeft <= 10 ? 'pulse 1s infinite' : 'none'}
                                        >
                                            {timeLeft}s
                                        </Text>
                                    </HStack>
                                    <HStack>
                                        <Icon as={Star} color={`${colorScheme}.500`} />
                                        <Text fontSize="3xl" fontWeight="bold">{score}</Text>
                                    </HStack>
                                </Flex>

                                {/* Question */}
                                {speedRoundAnswers[currentSpeedQuestion] && (
                                    <Box textAlign="center">
                                        <Heading
                                            as={motion.h3}
                                            key={currentSpeedQuestion}
                                            size="2xl"
                                            mb={8}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                        >
                                            {speedRoundAnswers[currentSpeedQuestion].german}
                                        </Heading>

                                        <SimpleGrid columns={2} spacing={4}>
                                            {speedRoundAnswers[currentSpeedQuestion].options.map((option, idx) => (
                                                <Button
                                                    key={idx}
                                                    onClick={() => handleSpeedAnswer(option, speedRoundAnswers[currentSpeedQuestion].english)}
                                                    height="auto"
                                                    py={6}
                                                    borderRadius="2xl"
                                                    whiteSpace="normal"
                                                    variant="outline"
                                                    fontSize="lg"
                                                    _hover={{ bg: `${colorScheme}.50`, borderColor: `${colorScheme}.300` }}
                                                    as={motion.button}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={`all 0.2s ${idx * 0.05}s`}
                                                >
                                                    {option}
                                                </Button>
                                            ))}
                                        </SimpleGrid>

                                        {/* Progress */}
                                        <Flex justify="center" gap={1} mt={6}>
                                            {speedRoundAnswers.map((_, idx) => (
                                                <Box
                                                    key={idx}
                                                    w={2}
                                                    h={2}
                                                    borderRadius="full"
                                                    bg={
                                                        idx < currentSpeedQuestion ? `${colorScheme}.400` :
                                                            idx === currentSpeedQuestion ? 'current' :
                                                                'blackAlpha.200'
                                                    }
                                                />
                                            ))}
                                        </Flex>
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* Active State - Tongue Twister */}
                        {challengeState === 'active' && currentChallenge.id === 'tongue_twister' && (
                            <VStack
                                key="tongue-active"
                                spacing={8}
                                textAlign="center"
                                as={motion.div}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <Text fontSize="3xl" fontStyle="italic" fontWeight="medium">
                                    "{tonguePhrase}"
                                </Text>

                                <HStack spacing={4}>
                                    <Button
                                        leftIcon={<Icon as={Volume2} />}
                                        onClick={() => speak(tonguePhrase)}
                                        size="lg"
                                        variant="outline"
                                        borderRadius="xl"
                                    >
                                        Listen
                                    </Button>

                                    {!isRecording ? (
                                        <Button
                                            leftIcon={<Icon as={Mic} />}
                                            onClick={startRecording}
                                            size="lg"
                                            colorScheme={colorScheme}
                                            borderRadius="xl"
                                        >
                                            Record
                                        </Button>
                                    ) : (
                                        <Button
                                            leftIcon={<Icon as={Mic} />}
                                            onClick={() => {
                                                stopRecording();
                                                setScore(prev => prev + 25);
                                                setChallengeState('completed');
                                            }}
                                            size="lg"
                                            colorScheme="red"
                                            borderRadius="xl"
                                            as={motion.button}
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 0.5, repeat: Infinity }}
                                        >
                                            Stop
                                        </Button>
                                    )}
                                </HStack>

                                {audioUrl && (
                                    <Box w="full" maxW="md">
                                        <audio src={audioUrl} controls style={{ width: '100%' }} />
                                    </Box>
                                )}
                            </VStack>
                        )}

                        {/* Completed State */}
                        {challengeState === 'completed' && (
                            <VStack
                                key="completed"
                                spacing={6}
                                textAlign="center"
                                as={motion.div}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.2 }}
                                >
                                    <Icon as={Trophy} boxSize={20} color={`${colorScheme}.400`} />
                                </motion.div>

                                <Box>
                                    <Heading size="xl" mb={2}>Challenge Complete!</Heading>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', delay: 0.4 }}
                                    >
                                        <Heading size="3xl" color={`${colorScheme}.500`}>
                                            +{score} XP
                                        </Heading>
                                    </motion.div>
                                </Box>

                                <Button
                                    leftIcon={<Icon as={RefreshCw} />}
                                    onClick={resetChallenge}
                                    variant="ghost"
                                    size="lg"
                                >
                                    Try Again
                                </Button>
                            </VStack>
                        )}
                    </AnimatePresence>
                </CardBody>
            </Card>

            {/* XP Reward Preview */}
            <Flex
                justify="center"
                align="center"
                gap={2}
                mt={6}
                color="gray.500"
                fontSize="sm"
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <Icon as={Flame} color="orange.400" />
                <Text>Complete daily challenges to earn bonus XP and maintain your streak!</Text>
            </Flex>
        </Container>
    );
}

// Helper function to shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
