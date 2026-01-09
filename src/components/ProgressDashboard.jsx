import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Flame, Trophy, Star, Zap, TrendingUp, Calendar,
    Award, CheckCircle, Lock, Crown, Target, Loader2
} from 'lucide-react';
import {
    Box,
    Card,
    CardBody,
    Container,
    Flex,
    Heading,
    Icon,
    Progress,
    SimpleGrid,
    Text,
    VStack,
    Badge,
    useColorModeValue,
    CircularProgress,
    CircularProgressLabel,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    HStack,
    Tooltip,
    GridItem
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useFirebaseProgress } from '../hooks/useFirebaseProgress';
import { achievements, levels, getCurrentLevel, getLevelProgress } from '../data/gameData';

export function ProgressDashboard() {
    const { currentUser } = useAuth();
    const {
        loading, xp, streak, stats, unlockedAchievements,
        level, syncLocalProgress
    } = useFirebaseProgress();

    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const bg = useColorModeValue('white', 'gray.800');
    const cardHoverBg = useColorModeValue('gray.50', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    // Sync local progress on first load
    useEffect(() => {
        if (currentUser) {
            syncLocalProgress();
        }
    }, [currentUser, syncLocalProgress]);

    const handleAchievementClick = (achievement) => {
        setSelectedAchievement(achievement);
        onOpen();
    };

    // Get level progress
    const levelProgress = getLevelProgress(xp);
    const nextLevel = levels.find(l => l.level === level.level + 1);
    const xpToNext = nextLevel ? nextLevel.minXp - xp : 0;

    if (loading) {
        return (
            <Flex align="center" justify="center" h="50vh">
                <Icon as={Loader2} boxSize={12} color="brand.500" animation="spin 1s linear infinite" />
            </Flex>
        );
    }

    // Show sign-in prompt if not logged in
    if (!currentUser) {
        return (
            <Container maxW="container.md" py={16}>
                <Card borderRadius="3xl" boxShadow="xl" textAlign="center" bg={bg}>
                    <CardBody py={12}>
                        <VStack spacing={6}>
                            <Icon as={Trophy} boxSize={16} color="yellow.400" />
                            <Heading size="lg">Track Your Progress</Heading>
                            <Text color="gray.500" maxW="md">
                                Sign in to track your XP, maintain streaks, unlock achievements, and compete on the leaderboard!
                            </Text>
                            <Badge colorScheme="blue" px={4} py={2} borderRadius="full" fontSize="sm">
                                Your progress will be saved automatically
                            </Badge>
                        </VStack>
                    </CardBody>
                </Card>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={6}>
            {/* Top Stats Row */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
                {/* Level Card */}
                <Card borderRadius="3xl" bg={bg} boxShadow="xl" overflow="hidden" position="relative">
                    <Box position="absolute" top={0} left={0} right={0} h={1} bgGradient={`linear(to-r, transparent, ${level.color}, transparent)`} />
                    <CardBody p={6}>
                        <Flex align="center" gap={4} mb={6}>
                            <Box position="relative">
                                <CircularProgress
                                    value={levelProgress}
                                    size="80px"
                                    thickness="8px"
                                    color={level.color}
                                    trackColor="gray.100"
                                >
                                    <CircularProgressLabel fontSize="2xl" fontWeight="black" color={level.color}>
                                        {level.level}
                                    </CircularProgressLabel>
                                </CircularProgress>
                            </Box>
                            <Box>
                                <Heading size="lg" mb={1}>{level.name}</Heading>
                                <Text color="gray.500" fontWeight="medium">{xp.toLocaleString()} XP</Text>
                            </Box>
                        </Flex>

                        <Box>
                            <Progress value={levelProgress} size="sm" colorScheme="brand" borderRadius="full" mb={2} />
                            {nextLevel && (
                                <Text fontSize="xs" color="gray.500" textAlign="right">
                                    {xpToNext} XP to {nextLevel.name}
                                </Text>
                            )}
                        </Box>
                    </CardBody>
                </Card>

                {/* Streak Card */}
                <Card borderRadius="3xl" bg={bg} boxShadow="xl" overflow="hidden" position="relative">
                    <Box position="absolute" top={0} left={0} right={0} h={1} bgGradient="linear(to-r, transparent, orange.400, transparent)" />
                    <CardBody p={6}>
                        <Flex align="center" gap={4} mb={6}>
                            <Box
                                p={3}
                                borderRadius="2xl"
                                bg="orange.50"
                                color="orange.500"
                                as={motion.div}
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Icon as={Flame} boxSize={8} />
                            </Box>
                            <Box>
                                <Heading size="2xl" color="orange.400">{streak}</Heading>
                                <Text color="gray.500" fontWeight="medium">Day Streak</Text>
                            </Box>
                        </Flex>

                        <HStack spacing={1} h={2}>
                            {[...Array(7)].map((_, i) => (
                                <Box
                                    key={i}
                                    flex={1}
                                    h="full"
                                    borderRadius="full"
                                    bg={i < Math.min(streak, 7) ? 'orange.400' : 'gray.100'}
                                />
                            ))}
                        </HStack>
                        <Text fontSize="xs" color="gray.500" mt={2}>Last 7 days</Text>
                    </CardBody>
                </Card>

                {/* Weekly Stats Card */}
                <Card borderRadius="3xl" bg={bg} boxShadow="xl" overflow="hidden" position="relative">
                    <Box position="absolute" top={0} left={0} right={0} h={1} bgGradient="linear(to-r, transparent, green.400, transparent)" />
                    <CardBody p={6}>
                        <Heading size="md" mb={6} display="flex" alignItems="center" gap={2}>
                            <Icon as={TrendingUp} color="green.400" />
                            Weekly Progress
                        </Heading>

                        <VStack spacing={4} align="stretch">
                            <Flex justify="space-between" align="center">
                                <Text color="gray.500" fontSize="sm">Words Learned</Text>
                                <Text fontWeight="bold" fontSize="lg">{stats.wordsLearned || 0}</Text>
                            </Flex>
                            <Flex justify="space-between" align="center">
                                <Text color="gray.500" fontSize="sm">Exams Taken</Text>
                                <Text fontWeight="bold" fontSize="lg">{stats.examsTaken || 0}</Text>
                            </Flex>
                            <Flex justify="space-between" align="center">
                                <Text color="gray.500" fontSize="sm">Voice Sessions</Text>
                                <Text fontWeight="bold" fontSize="lg">{stats.pronunciationSessions || 0}</Text>
                            </Flex>
                        </VStack>
                    </CardBody>
                </Card>
            </SimpleGrid>

            {/* Achievements Section */}
            <Box>
                <Heading size="lg" mb={6} display="flex" alignItems="center" gap={3}>
                    <Icon as={Trophy} color="yellow.400" boxSize={8} />
                    Achievements
                    <Badge colorScheme="gray" borderRadius="full" px={3} py={1} fontSize="sm" fontWeight="normal">
                        {unlockedAchievements.length}/{achievements.length} unlocked
                    </Badge>
                </Heading>

                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                    {achievements.map((achievement, index) => {
                        const isUnlocked = unlockedAchievements.includes(achievement.id);

                        return (
                            <motion.div
                                key={achievement.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    borderRadius="2xl"
                                    cursor="pointer"
                                    bg={isUnlocked ? 'yellow.50' : bg}
                                    variant={isUnlocked ? 'outline' : 'elevated'}
                                    borderColor={isUnlocked ? 'yellow.400' : 'transparent'}
                                    boxShadow={isUnlocked ? 'none' : 'sm'}
                                    opacity={isUnlocked ? 1 : 0.6}
                                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                                    transition="all 0.2s"
                                    onClick={() => handleAchievementClick(achievement)}
                                >
                                    <CardBody textAlign="center" position="relative">
                                        <Box fontSize="4xl" mb={3}>
                                            {isUnlocked ? achievement.icon : <Icon as={Lock} color="gray.400" />}
                                        </Box>
                                        <Text fontWeight="bold" fontSize="sm" mb={1} color={isUnlocked ? 'gray.800' : 'gray.500'}>
                                            {achievement.name}
                                        </Text>
                                        <Badge colorScheme="yellow" variant="subtle" borderRadius="full">
                                            +{achievement.xpReward} XP
                                        </Badge>

                                        {isUnlocked && (
                                            <Icon
                                                as={CheckCircle}
                                                color="green.400"
                                                position="absolute"
                                                top={2}
                                                right={2}
                                                boxSize={5}
                                            />
                                        )}
                                    </CardBody>
                                </Card>
                            </motion.div>
                        );
                    })}
                </SimpleGrid>
            </Box>

            {/* Achievement Details Modal */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
                <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
                <ModalContent borderRadius="3xl" textAlign="center" py={4}>
                    <ModalCloseButton />
                    <ModalBody py={8}>
                        <Box fontSize="6xl" mb={4}>{selectedAchievement?.icon}</Box>
                        <Heading size="lg" mb={2}>{selectedAchievement?.name}</Heading>
                        <Text color="gray.500" mb={6}>{selectedAchievement?.description}</Text>

                        <Badge
                            colorScheme="yellow"
                            fontSize="md"
                            px={4}
                            py={2}
                            borderRadius="full"
                            display="inline-flex"
                            alignItems="center"
                            gap={2}
                        >
                            <Icon as={Zap} fill="currentColor" />
                            +{selectedAchievement?.xpReward} XP
                        </Badge>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    );
}
