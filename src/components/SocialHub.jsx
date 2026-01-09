import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, MessageCircle, Mic, Star, Clock, Globe,
    Check, X, Phone, Video, Search, Filter,
    ChevronRight, Send, Sparkles
} from 'lucide-react';
import {
    Box,
    Button,
    Card,
    CardBody,
    Container,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    SimpleGrid,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
    Avatar,
    AvatarBadge,
    Badge,
    useColorModeValue,
    Tag,
    TagLabel,
    TagLeftIcon
} from '@chakra-ui/react';
import { speakingPartners, chatRooms, conversationPrompts, sessionTypes } from '../data/socialData';

export function SocialHub() {
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    const bg = useColorModeValue('white', 'gray.800');
    const inputBg = useColorModeValue('gray.50', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    // Filter partners
    const filteredPartners = speakingPartners.filter(partner => {
        const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            partner.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesOnline = !showOnlineOnly || partner.online;
        return matchesSearch && matchesOnline;
    });

    return (
        <Container maxW="container.xl">
            <Tabs variant="soft-rounded" colorScheme="brand" align="center" isLazy>
                <TabList mb={8} gap={2}>
                    <Tab px={6} py={3} _selected={{ bg: 'brand.500', color: 'white' }}>
                        <Icon as={Users} mr={2} /> Speaking Partners
                    </Tab>
                    <Tab px={6} py={3} _selected={{ bg: 'brand.500', color: 'white' }}>
                        <Icon as={MessageCircle} mr={2} /> Chat Rooms
                    </Tab>
                    <Tab px={6} py={3} _selected={{ bg: 'brand.500', color: 'white' }}>
                        <Icon as={Mic} mr={2} /> Start Session
                    </Tab>
                </TabList>

                <TabPanels>
                    {/* Speaking Partners Tab */}
                    <TabPanel px={0}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Search & Filter */}
                            <Flex gap={4} mb={6}>
                                <InputGroup size="lg">
                                    <InputLeftElement pointerEvents="none">
                                        <Icon as={Search} color="gray.400" />
                                    </InputLeftElement>
                                    <Input
                                        placeholder="Search by name or interests..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        bg={bg}
                                        borderRadius="xl"
                                        border="0"
                                        boxShadow="sm"
                                        _focus={{ boxShadow: 'md', ring: 2, ringColor: 'brand.500' }}
                                    />
                                </InputGroup>
                                <Button
                                    size="lg"
                                    leftIcon={<Box w={2} h={2} borderRadius="full" bg={showOnlineOnly ? 'green.400' : 'gray.400'} />}
                                    onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                                    colorScheme={showOnlineOnly ? 'green' : 'gray'}
                                    variant={showOnlineOnly ? 'solid' : 'outline'}
                                    borderRadius="xl"
                                    bg={bg}
                                >
                                    Online Only
                                </Button>
                            </Flex>

                            {/* Partners Grid */}
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                {filteredPartners.map((partner, index) => (
                                    <motion.div
                                        key={partner.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card
                                            borderRadius="2xl"
                                            cursor="pointer"
                                            bg={bg}
                                            boxShadow="sm"
                                            borderWidth="2px"
                                            borderColor={selectedPartner?.id === partner.id ? 'brand.500' : 'transparent'}
                                            _hover={{ borderColor: 'brand.200', transform: 'translateY(-2px)', boxShadow: 'md' }}
                                            transition="all 0.2s"
                                            onClick={() => setSelectedPartner(partner)}
                                        >
                                            <CardBody>
                                                <Flex gap={4}>
                                                    <Avatar size="lg" name={partner.name} src={partner.avatarUrl} bg="brand.100" color="brand.600">
                                                        {partner.online && <AvatarBadge boxSize="1em" bg="green.400" />}
                                                    </Avatar>

                                                    <Box flex="1">
                                                        <Flex align="center" gap={2} mb={1}>
                                                            <Heading size="md">{partner.name}</Heading>
                                                            <Badge colorScheme="blue" variant="subtle" borderRadius="full">
                                                                {partner.level}
                                                            </Badge>
                                                        </Flex>
                                                        <Text color="gray.500" fontSize="sm" mb={3} noOfLines={2}>
                                                            {partner.bio}
                                                        </Text>

                                                        <HStack spacing={4} fontSize="sm" color="gray.500">
                                                            <HStack spacing={1}>
                                                                <Icon as={Star} color="yellow.400" fill="currentColor" />
                                                                <Text fontWeight="bold" color="gray.700">{partner.rating}</Text>
                                                            </HStack>
                                                            <HStack spacing={1}>
                                                                <Icon as={MessageCircle} />
                                                                <Text>{partner.sessionsCompleted} sessions</Text>
                                                            </HStack>
                                                        </HStack>
                                                    </Box>

                                                    <IconButton
                                                        aria-label="Action"
                                                        icon={partner.online ? <Phone size={20} /> : <Clock size={20} />}
                                                        colorScheme={partner.online ? 'green' : 'gray'}
                                                        variant="ghost"
                                                        size="lg"
                                                        isRound
                                                    />
                                                </Flex>

                                                <Stack direction="row" spacing={2} mt={5} flexWrap="wrap">
                                                    {partner.interests.map((interest) => (
                                                        <Tag key={interest} size="sm" variant="subtle" colorScheme="gray" borderRadius="full">
                                                            <TagLabel>{interest}</TagLabel>
                                                        </Tag>
                                                    ))}
                                                </Stack>
                                            </CardBody>
                                        </Card>
                                    </motion.div>
                                ))}
                            </SimpleGrid>

                            {filteredPartners.length === 0 && (
                                <VStack py={12} color="gray.500">
                                    <Icon as={Users} boxSize={12} opacity={0.3} />
                                    <Text>No partners found matching your criteria</Text>
                                </VStack>
                            )}
                        </motion.div>
                    </TabPanel>

                    {/* Chat Rooms Tab */}
                    <TabPanel px={0}>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                            {chatRooms.map((room, index) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card
                                        borderRadius="2xl"
                                        cursor="pointer"
                                        bg={bg}
                                        boxShadow="sm"
                                        overflow="hidden"
                                        borderWidth="1px"
                                        borderColor="transparent"
                                        _hover={{ borderColor: `${room.color}40`, boxShadow: 'md' }}
                                        onClick={() => setSelectedRoom(room)}
                                    >
                                        <Box h="1" bg={room.color} />
                                        <CardBody>
                                            <Text fontSize="4xl" mb={4}>{room.icon}</Text>
                                            <Heading size="md" mb={2}>{room.name}</Heading>
                                            <Text color="gray.500" fontSize="sm" mb={4} noOfLines={2}>
                                                {room.description}
                                            </Text>

                                            <Flex justify="space-between" align="center">
                                                <Badge
                                                    bg={`${room.color}20`}
                                                    color={room.color}
                                                    borderRadius="md"
                                                    px={2}
                                                >
                                                    {room.level}
                                                </Badge>
                                                <HStack spacing={1} fontSize="sm" color="green.500" fontWeight="medium">
                                                    <Box w={2} h={2} borderRadius="full" bg="green.400" as={motion.div} animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                                                    <Text>{room.activeUsers} online</Text>
                                                </HStack>
                                            </Flex>
                                        </CardBody>
                                    </Card>
                                </motion.div>
                            ))}
                        </SimpleGrid>
                    </TabPanel>

                    {/* Start Session Tab */}
                    <TabPanel px={0}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={8}>
                            {sessionTypes.map((type, index) => (
                                <motion.div
                                    key={type.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card
                                        borderRadius="2xl"
                                        cursor="pointer"
                                        bg={bg}
                                        boxShadow="sm"
                                        borderWidth="1px"
                                        borderColor="transparent"
                                        _hover={{ borderColor: 'brand.200', boxShadow: 'md' }}
                                    >
                                        <CardBody>
                                            <Flex gap={4} align="center">
                                                <Text fontSize="4xl">{type.icon}</Text>
                                                <Box flex="1">
                                                    <Heading size="sm" mb={1}>{type.name}</Heading>
                                                    <Text fontSize="sm" color="gray.500" mb={1}>{type.description}</Text>
                                                    <Text fontSize="xs" fontWeight="bold" color="pink.500">{type.duration}</Text>
                                                </Box>
                                                <Icon as={ChevronRight} color="gray.400" />
                                            </Flex>
                                        </CardBody>
                                    </Card>
                                </motion.div>
                            ))}
                        </SimpleGrid>

                        <Card borderRadius="2xl" bg="linear-gradient(135deg, #1A202C 0%, #2D3748 100%)" color="white" boxShadow="xl">
                            <CardBody>
                                <HStack mb={4} spacing={2}>
                                    <Icon as={Sparkles} color="yellow.400" />
                                    <Heading size="md">Conversation Starters</Heading>
                                </HStack>

                                <VStack align="stretch" spacing={3}>
                                    {conversationPrompts.beginner.slice(0, 3).map((prompt, index) => (
                                        <Box
                                            key={index}
                                            bg="whiteAlpha.100"
                                            p={4}
                                            borderRadius="xl"
                                            transition="all 0.2s"
                                            _hover={{ bg: 'whiteAlpha.200' }}
                                        >
                                            <Badge colorScheme="green" variant="solid" mb={2} borderRadius="full">
                                                {prompt.topic}
                                            </Badge>
                                            <Text fontWeight="medium" mb={2}>{prompt.prompt}</Text>
                                            <HStack spacing={2} flexWrap="wrap">
                                                {prompt.vocabulary.map((word) => (
                                                    <Text key={word} fontSize="xs" color="gray.400" fontStyle="italic">
                                                        {word}
                                                    </Text>
                                                ))}
                                            </HStack>
                                        </Box>
                                    ))}
                                </VStack>
                            </CardBody>
                        </Card>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    );
}
