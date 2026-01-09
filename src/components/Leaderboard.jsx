import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy, Medal, TrendingUp, Crown, Flame, Sparkles
} from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    Flex,
    VStack,
    HStack,
    Avatar,
    Badge,
    Spinner,
    useColorModeValue,
    Icon,
    Center
} from '@chakra-ui/react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useFirebaseProgress } from '../hooks/useFirebaseProgress';
import { sampleLeaderboard, getCurrentLevel } from '../data/gameData';

export function Leaderboard() {
    const [timeframe, setTimeframe] = useState('weekly');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { currentUser } = useAuth();
    const { xp } = useFirebaseProgress();

    const bg = useColorModeValue('white', 'gray.800');
    const accentColor = useColorModeValue('brand.500', 'brand.200');
    const cardBg = useColorModeValue('white', 'gray.700');
    const podiumBg = useColorModeValue('gray.50', 'gray.700');

    // Fetch leaderboard data
    useEffect(() => {
        async function fetchLeaderboard() {
            setLoading(true);
            try {
                const leaderboardRef = collection(db, 'leaderboard', timeframe, 'users');
                const q = query(leaderboardRef, orderBy('xp', 'desc'), limit(10));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const data = snapshot.docs.map((doc, index) => ({
                        id: doc.id,
                        position: index + 1,
                        ...doc.data()
                    }));
                    setLeaderboardData(data);
                } else {
                    // Use sample data if no real data
                    setLeaderboardData(sampleLeaderboard);
                }
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
                // Fall back to sample data
                setLeaderboardData(sampleLeaderboard);
            } finally {
                setLoading(false);
            }
        }

        fetchLeaderboard();
    }, [timeframe]);

    // Sort leaderboard by XP
    const sortedLeaderboard = [...leaderboardData].sort((a, b) => b.xp - a.xp);

    // Get user's position
    const userPosition = currentUser
        ? sortedLeaderboard.findIndex(p => p.id === currentUser.uid) + 1 ||
        sortedLeaderboard.filter(p => p.xp > xp).length + 1
        : sortedLeaderboard.filter(p => p.xp > xp).length + 1;

    if (loading) {
        return (
            <Center py={20}>
                <Spinner size="xl" color="brand.500" thickness="4px" />
            </Center>
        );
    }

    return (
        <Container maxW="container.md" py={6}>
            {/* Header */}
            <VStack spacing={4} mb={8} textAlign="center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                >
                    <Icon as={Trophy} boxSize={12} color="yellow.400" />
                </motion.div>
                <Box>
                    <Heading size="lg" mb={2}>Leaderboard</Heading>
                    <Text color="gray.500">Compete with other German learners!</Text>
                </Box>
            </VStack>

            {/* Timeframe Toggle */}
            <Center mb={8}>
                <ButtonGroup isAttached variant="outline" borderRadius="xl">
                    {[
                        { id: 'weekly', label: 'This Week' },
                        { id: 'allTime', label: 'All Time' }
                    ].map((tf) => (
                        <Button
                            key={tf.id}
                            onClick={() => setTimeframe(tf.id)}
                            colorScheme={timeframe === tf.id ? 'brand' : 'gray'}
                            variant={timeframe === tf.id ? 'solid' : 'outline'}
                            borderRadius="xl"
                            px={6}
                        >
                            {tf.label}
                        </Button>
                    ))}
                </ButtonGroup>
            </Center>

            {/* Your Position Card */}
            <Card
                mb={8}
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="lg"
                bgGradient="linear(to-r, brand.500, brand.600)"
                color="white"
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <CardBody>
                    <Flex align="center" gap={4}>
                        <Flex
                            w={14}
                            h={14}
                            borderRadius="2xl"
                            bg="whiteAlpha.200"
                            align="center"
                            justify="center"
                            fontSize="2xl"
                            fontWeight="black"
                        >
                            #{userPosition}
                        </Flex>
                        <Box flex={1}>
                            <Heading size="md" color="white">Your Position</Heading>
                            <Text color="whiteAlpha.800">{xp.toLocaleString()} XP</Text>
                        </Box>
                        <Icon as={Sparkles} color="yellow.300" boxSize={6} />
                    </Flex>
                </CardBody>
            </Card>

            {/* Top 3 Podium */}
            {sortedLeaderboard.length >= 3 && (
                <Flex justify="center" align="flex-end" gap={4} mb={10} px={2}>
                    {/* 2nd Place */}
                    <VStack
                        as={motion.div}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        spacing={3}
                    >
                        <Avatar
                            size="lg"
                            name={sortedLeaderboard[1]?.name}
                            icon={!sortedLeaderboard[1]?.name && <Text fontSize="2xl">👤</Text>}
                            src={sortedLeaderboard[1]?.avatar}
                            borderWidth={3}
                            borderColor="gray.300"
                        />
                        <Box textAlign="center">
                            <Text fontWeight="semibold" noOfLines={1} maxW="100px">{sortedLeaderboard[1]?.name}</Text>
                            <Text fontSize="sm" color="gray.500">{sortedLeaderboard[1]?.xp?.toLocaleString()} XP</Text>
                        </Box>
                        <Flex
                            w="80px"
                            h="100px"
                            bg="gray.300"
                            borderTopRadius="xl"
                            align="center"
                            justify="center"
                            bgGradient="linear(to-b, gray.300, gray.100)"
                        >
                            <Icon as={Medal} boxSize={8} color="white" />
                        </Flex>
                    </VStack>

                    {/* 1st Place */}
                    <VStack
                        as={motion.div}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        spacing={3}
                        zIndex={1}
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Icon as={Crown} boxSize={8} color="yellow.400" />
                        </motion.div>
                        <Avatar
                            size="xl"
                            name={sortedLeaderboard[0]?.name}
                            icon={!sortedLeaderboard[0]?.name && <Text fontSize="3xl">👤</Text>}
                            src={sortedLeaderboard[0]?.avatar}
                            borderWidth={4}
                            borderColor="yellow.400"
                            boxShadow="xl"
                        />
                        <Box textAlign="center">
                            <Text fontWeight="bold" fontSize="lg" noOfLines={1} maxW="120px">{sortedLeaderboard[0]?.name}</Text>
                            <Text fontSize="md" color="yellow.500" fontWeight="bold">{sortedLeaderboard[0]?.xp?.toLocaleString()} XP</Text>
                        </Box>
                        <Flex
                            w="100px"
                            h="130px"
                            bg="yellow.400"
                            borderTopRadius="xl"
                            align="center"
                            justify="center"
                            bgGradient="linear(to-b, yellow.400, yellow.200)"
                            boxShadow="lg"
                        >
                            <Icon as={Trophy} boxSize={10} color="white" />
                        </Flex>
                    </VStack>

                    {/* 3rd Place */}
                    <VStack
                        as={motion.div}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        spacing={3}
                    >
                        <Avatar
                            size="lg"
                            name={sortedLeaderboard[2]?.name}
                            icon={!sortedLeaderboard[2]?.name && <Text fontSize="2xl">👤</Text>}
                            src={sortedLeaderboard[2]?.avatar}
                            borderWidth={3}
                            borderColor="orange.300"
                        />
                        <Box textAlign="center">
                            <Text fontWeight="semibold" noOfLines={1} maxW="100px">{sortedLeaderboard[2]?.name}</Text>
                            <Text fontSize="sm" color="gray.500">{sortedLeaderboard[2]?.xp?.toLocaleString()} XP</Text>
                        </Box>
                        <Flex
                            w="80px"
                            h="80px"
                            bg="orange.300"
                            borderTopRadius="xl"
                            align="center"
                            justify="center"
                            bgGradient="linear(to-b, orange.300, orange.100)"
                        >
                            <Icon as={Medal} boxSize={6} color="white" />
                        </Flex>
                    </VStack>
                </Flex>
            )}

            {/* Rest of Leaderboard */}
            <Card borderRadius="2xl" overflow="hidden" boxShadow="md" bg={bg}>
                <VStack spacing={0} divider={<Box w="full" h="1px" bg="gray.100" />}>
                    {sortedLeaderboard.slice(3).map((player, index) => {
                        const position = index + 4;
                        const level = getCurrentLevel(player.xp);
                        const isCurrentUser = currentUser && player.id === currentUser.uid;

                        return (
                            <Box
                                key={player.id}
                                w="full"
                                p={4}
                                bg={isCurrentUser ? 'brand.50' : 'transparent'}
                                _hover={{ bg: isCurrentUser ? 'brand.100' : 'gray.50' }}
                                sx={{ transition: 'background 0.2s' }}
                                as={motion.div}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <Flex align="center" gap={4}>
                                    <Text w={8} textAlign="center" fontWeight="bold" color="gray.500">
                                        {position}
                                    </Text>

                                    <Avatar
                                        size="md"
                                        name={player.name}
                                        src={player.avatar}
                                        bg={`${level.color}20`}
                                        color={level.color}
                                    >
                                        {!player.name && !player.avatar && '👤'}
                                    </Avatar>

                                    <Box flex={1}>
                                        <HStack>
                                            <Text fontWeight="semibold">
                                                {player.name}
                                            </Text>
                                            {isCurrentUser && (
                                                <Badge colorScheme="brand" variant="solid" fontSize="xs" borderRadius="full">
                                                    YOU
                                                </Badge>
                                            )}
                                        </HStack>

                                        <HStack fontSize="sm" spacing={3}>
                                            <Text color={level.color} fontWeight="medium">{level.name}</Text>
                                            {player.streak > 0 && (
                                                <HStack spacing={1} color="orange.400">
                                                    <Icon as={Flame} boxSize={3} />
                                                    <Text>{player.streak}</Text>
                                                </HStack>
                                            )}
                                        </HStack>
                                    </Box>

                                    <Box textAlign="right">
                                        <Text fontWeight="bold" color="gray.700">{player.xp?.toLocaleString()}</Text>
                                        <Text fontSize="xs" color="gray.500">XP</Text>
                                    </Box>
                                </Flex>
                            </Box>
                        );
                    })}
                </VStack>
            </Card>
        </Container>
    );
}
