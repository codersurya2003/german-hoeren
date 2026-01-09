import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Eye, EyeOff, Sparkles, BookOpen } from 'lucide-react';
import {
    Box,
    Text,
    Badge,
    IconButton,
    useColorModeValue,
    Card,
    VStack,
    HStack,
    Divider,
    Icon,
    Tooltip
} from '@chakra-ui/react';
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

    // Type color mapping using Chakra theme tokens
    const typeColorScheme = {
        'Noun (m)': 'blue',
        'Noun (f)': 'pink',
        'Noun (n)': 'green',
        'Verb': 'orange',
        'Adjective': 'purple',
        'Adverb': 'cyan',
        'default': 'yellow'
    };

    const colorScheme = typeColorScheme[word.type] || typeColorScheme['default'];
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue(`${colorScheme}.200`, `${colorScheme}.700`);

    return (
        <motion.div
            layout
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ height: '100%' }}
        >
            <Card
                h="full"
                cursor="pointer"
                onClick={handleReveal}
                bg={cardBg}
                borderColor={borderColor}
                borderTopWidth="4px" // Colored top border for type hint
                borderTopColor={`${colorScheme}.400`}
                boxShadow="md"
                _hover={{ boxShadow: 'lg' }}
                overflow="hidden"
                position="relative"
            >
                <Box p={6} h="full" display="flex" flexDirection="column">
                    {/* Header */}
                    <Flex justify="space-between" align="start" mb={4}>
                        <Badge
                            colorScheme={colorScheme}
                            px={2}
                            py={1}
                            borderRadius="full"
                            textTransform="uppercase"
                            fontSize="xs"
                            letterSpacing="wide"
                        >
                            {word.type}
                        </Badge>
                        <Tooltip label="Listen to pronunciation" hasArrow>
                            <IconButton
                                aria-label="Play pronunciation"
                                icon={<Volume2 size={20} />}
                                onClick={handlePlay}
                                variant="ghost"
                                colorScheme={colorScheme}
                                isRound
                                isLoading={isPlaying}
                                size="sm"
                                _hover={{ bg: `${colorScheme}.50` }}
                            />
                        </Tooltip>
                    </Flex>

                    {/* German Word */}
                    <Box flex="1" display="flex" alignItems="center" justify="center" py={4}>
                        <Text
                            fontSize="4xl"
                            fontWeight="800"
                            textAlign="center"
                            color="gray.700"
                            lineHeight="shorter"
                        >
                            {word.german}
                        </Text>
                    </Box>

                    {/* Translation Section */}
                    <AnimatePresence mode="wait">
                        {showTranslation ? (
                            <motion.div
                                key="translation"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Divider my={3} borderColor="gray.100" />

                                <VStack spacing={2} align="center">
                                    <HStack spacing={2} color={`${colorScheme}.600`}>
                                        <Icon as={Sparkles} size={14} />
                                        <Text fontSize="xl" fontWeight="bold">
                                            {word.english}
                                        </Text>
                                    </HStack>

                                    <Text
                                        fontSize="sm"
                                        color="gray.500"
                                        fontStyle="italic"
                                        textAlign="center"
                                        bg="gray.50"
                                        p={2}
                                        borderRadius="md"
                                        w="full"
                                    >
                                        "{word.example}"
                                    </Text>

                                    <HStack spacing={1} color="gray.400" pt={2}>
                                        <Icon as={EyeOff} size={12} />
                                        <Text fontSize="xs" fontWeight="medium" textTransform="uppercase">Tap to hide</Text>
                                    </HStack>
                                </VStack>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="hint"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Box
                                    py={8}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    color="gray.400"
                                >
                                    <HStack spacing={2} _groupHover={{ color: 'brand.500' }} transition="color 0.2s">
                                        <Icon as={Eye} size={16} />
                                        <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="widest">
                                            Tap to reveal
                                        </Text>
                                    </HStack>
                                </Box>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Box>
            </Card>
        </motion.div>
    );
}

// Helper component import
import { Flex } from '@chakra-ui/react';
