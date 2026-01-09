import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, CheckCircle, XCircle, ArrowRight, RefreshCcw, Award, Target, Flame } from 'lucide-react';
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
    IconButton,
    Progress,
    Text,
    VStack,
    Badge,
    useColorModeValue,
    CircularProgress,
    CircularProgressLabel,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Divider,
    Icon
} from '@chakra-ui/react';
import { useTTS } from '../hooks/useTTS';
import { generateQuestions } from '../data/questions';
import { useFirebaseProgress } from '../hooks/useFirebaseProgress';
import { useAuth } from '../contexts/AuthContext';
import { xpRewards } from '../data/gameData';

export function ExamMode() {
    const [questions, setQuestions] = useState(() => generateQuestions(10));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [examCompleted, setExamCompleted] = useState(false);
    const { speak } = useTTS();

    // Firebase progress tracking
    const { currentUser } = useAuth();
    const { addXp, updateStats, recordPractice } = useFirebaseProgress();

    const question = questions[currentIndex];
    const isLast = currentIndex === questions.length - 1;

    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleOptionClick = (option) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);
        if (option === question.correct) {
            setScore(s => s + 1);
            setStreak(s => s + 1);
        } else {
            setStreak(0);
        }
    };

    const handleNext = () => {
        if (isLast) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(currentIndex + 1);
            setIsAnswered(false);
            setSelectedOption(null);
        }
    };

    const resetExam = () => {
        setQuestions(generateQuestions(10));
        setCurrentIndex(0);
        setScore(0);
        setStreak(0);
        setIsAnswered(false);
        setSelectedOption(null);
        setExamCompleted(false);
    };

    // Save progress when exam is completed
    React.useEffect(() => {
        const saveProgress = async () => {
            if (currentIndex >= questions.length && !examCompleted && currentUser) {
                setExamCompleted(true);

                // Calculate XP based on score
                const baseXp = score * 10; // 10 XP per correct answer
                const bonusXp = score === questions.length ? 50 : 0; // Perfect score bonus
                const totalXp = baseXp + bonusXp;

                // Save to Firebase
                await addXp(totalXp);
                await updateStats({ examsTaken: 1 });
                await recordPractice();
            }
        };
        saveProgress();
    }, [currentIndex, questions.length, examCompleted, currentUser, score, addXp, updateStats, recordPractice]);

    // Calculate performance message
    const getPerformanceMessage = () => {
        const percentage = (score / questions.length) * 100;
        if (percentage >= 90) return { text: "Outstanding!", colorScheme: "green", emoji: "🏆" };
        if (percentage >= 70) return { text: "Great work!", colorScheme: "yellow", emoji: "⭐" };
        if (percentage >= 50) return { text: "Good effort!", colorScheme: "blue", emoji: "👍" };
        return { text: "Keep practicing!", colorScheme: "pink", emoji: "💪" };
    };

    // Finished State
    if (currentIndex >= questions.length) {
        const performance = getPerformanceMessage();

        return (
            <Container maxW="container.sm" py={10}>
                <Card textAlign="center" borderRadius="3xl" boxShadow="xl" bg={bg} overflow="hidden">
                    <CardBody py={10}>
                        <VStack spacing={6}>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                            >
                                <Text fontSize="6xl">{performance.emoji}</Text>
                            </motion.div>

                            <Box>
                                <Heading size="xl" mb={2}>Exam Complete!</Heading>
                                <Text fontSize="xl" fontWeight="bold" color={`${performance.colorScheme}.500`}>
                                    {performance.text}
                                </Text>
                            </Box>

                            <Box position="relative">
                                <CircularProgress
                                    value={(score / questions.length) * 100}
                                    size="160px"
                                    thickness="8px"
                                    color={`${performance.colorScheme}.400`}
                                    trackColor="gray.100"
                                >
                                    <CircularProgressLabel>
                                        <VStack spacing={0}>
                                            <Text fontSize="4xl" fontWeight="black" lineHeight="1">
                                                {score}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                / {questions.length}
                                            </Text>
                                        </VStack>
                                    </CircularProgressLabel>
                                </CircularProgress>
                            </Box>

                            <Button
                                onClick={resetExam}
                                size="lg"
                                colorScheme={performance.colorScheme}
                                leftIcon={<RefreshCcw size={20} />}
                                w="full"
                                maxW="sm"
                                borderRadius="xl"
                                py={7}
                                fontSize="lg"
                                boxShadow="lg"
                                _hover={{ transform: 'translateY(-2px)' }}
                            >
                                Try Again
                            </Button>
                        </VStack>
                    </CardBody>
                </Card>
            </Container>
        );
    }

    return (
        <Container maxW="container.md" py={6}>
            <Card borderRadius="3xl" boxShadow="xl" bg={bg} overflow="hidden" minH="600px" position="relative">
                {/* Progress Bar */}
                <Progress
                    value={((currentIndex + 1) / questions.length) * 100}
                    size="xs"
                    colorScheme="brand"
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                />

                <CardBody p={8} pb={32}>
                    {/* Header */}
                    <Flex justify="space-between" align="center" mb={10}>
                        <HStack spacing={4}>
                            <HStack color="gray.500" fontSize="sm" fontWeight="semibold">
                                <Icon as={Target} />
                                <Text>Question {currentIndex + 1} / {questions.length}</Text>
                            </HStack>

                            {streak > 1 && (
                                <Badge colorScheme="orange" variant="subtle" px={2} borderRadius="full" display="flex" alignItems="center">
                                    <Icon as={Flame} mr={1} size={12} /> {streak} streak
                                </Badge>
                            )}
                        </HStack>

                        <Badge
                            colorScheme={question.type === 'listening' ? 'pink' : 'blue'}
                            px={3}
                            py={1}
                            borderRadius="full"
                            textTransform="uppercase"
                        >
                            {question.type}
                        </Badge>
                    </Flex>

                    {/* Question Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Box mb={10} minH="120px" display="flex" alignItems="center" justifyContent="center">
                                {question.type === 'listening' ? (
                                    <VStack>
                                        <IconButton
                                            icon={<Volume2 size={32} />}
                                            onClick={() => speak(question.textToSpeak)}
                                            size="lg"
                                            w={24}
                                            h={24}
                                            isRound
                                            colorScheme="pink"
                                            variant="solid"
                                            boxShadow="lg"
                                            _hover={{ transform: 'scale(1.05)' }}
                                        />
                                        <Text fontSize="sm" color="gray.500" fontWeight="medium">
                                            Click to listen
                                        </Text>
                                    </VStack>
                                ) : (
                                    <Heading size="lg" textAlign="center" lineHeight="tall">
                                        {question.question}
                                    </Heading>
                                )}
                            </Box>

                            {/* Options */}
                            <VStack spacing={3}>
                                {question.options.map((option, idx) => {
                                    let variant = 'outline';
                                    let colorScheme = 'gray';
                                    let rightIcon = null;

                                    if (isAnswered) {
                                        if (option === question.correct) {
                                            variant = 'solid';
                                            colorScheme = 'green';
                                            rightIcon = <CheckCircle size={20} />;
                                        } else if (option === selectedOption) {
                                            variant = 'solid';
                                            colorScheme = 'red';
                                            rightIcon = <XCircle size={20} />;
                                        } else {
                                            variant = 'ghost';
                                        }
                                    }

                                    return (
                                        <motion.div key={option} style={{ width: '100%' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                                            <Button
                                                onClick={() => handleOptionClick(option)}
                                                isDisabled={isAnswered}
                                                w="full"
                                                h="auto"
                                                py={4}
                                                variant={variant}
                                                colorScheme={colorScheme}
                                                justifyContent="space-between"
                                                textAlign="left"
                                                fontSize="lg"
                                                fontWeight="medium"
                                                rightIcon={rightIcon}
                                                _hover={!isAnswered ? { bg: 'brand.50', borderColor: 'brand.500' } : {}}
                                            >
                                                {option}
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </VStack>
                        </motion.div>
                    </AnimatePresence>
                </CardBody>

                <AnimatePresence>
                    {isAnswered && (
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                borderTop: '1px solid',
                                borderColor: borderColor
                            }}
                        >
                            <Box
                                bg={selectedOption === question.correct ? 'green.50' : 'red.50'}
                                p={6}
                                borderTopWidth="4px"
                                borderTopColor={selectedOption === question.correct ? 'green.400' : 'red.400'}
                            >
                                <Flex justify="space-between" align="center" gap={4}>
                                    <Box flex="1">
                                        <HStack mb={1} color={selectedOption === question.correct ? 'green.700' : 'red.700'}>
                                            <Icon as={selectedOption === question.correct ? CheckCircle : XCircle} />
                                            <Text fontWeight="bold" fontSize="lg">
                                                {selectedOption === question.correct ? 'Richtig!' : 'Falsch...'}
                                            </Text>
                                        </HStack>
                                        <Text color="gray.600" fontSize="sm">
                                            {question.explanation}
                                        </Text>
                                    </Box>
                                    <Button
                                        onClick={handleNext}
                                        colorScheme={selectedOption === question.correct ? 'green' : 'red'}
                                        size="lg"
                                        rightIcon={<ArrowRight />}
                                        boxShadow="md"
                                    >
                                        {isLast ? 'Finish' : 'Next'}
                                    </Button>
                                </Flex>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </Container>
    );
}
