import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, Send, Sparkles, Volume2, Lightbulb,
    BookOpen, HelpCircle, RefreshCw
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
    InputRightElement,
    Text,
    VStack,
    Badge,
    useColorModeValue,
    Avatar,
    Divider
} from '@chakra-ui/react';
import { useTTS } from '../hooks/useTTS';

// Simple German learning Q&A responses
const FAQ_RESPONSES = {
    // Grammar questions
    'der die das': {
        answer: 'In German, nouns have three genders:\n\n• **der** (masculine) - der Mann, der Tisch\n• **die** (feminine) - die Frau, die Lampe\n• **das** (neuter) - das Kind, das Buch\n\nTip: Learn each noun with its article!',
        german: 'Der Artikel ist sehr wichtig!'
    },
    'akkusativ': {
        answer: 'The **Akkusativ** (accusative) case is used for direct objects:\n\n• der → den (only masculine changes)\n• die → die\n• das → das\n\nExample: Ich sehe **den** Mann.',
        german: 'Ich sehe den Mann.'
    },
    'dativ': {
        answer: 'The **Dativ** (dative) case is used for indirect objects:\n\n• der → dem\n• die → der\n• das → dem\n\nExample: Ich gebe **dem** Mann das Buch.',
        german: 'Ich gebe dem Mann das Buch.'
    },
    'verb conjugation': {
        answer: 'Regular German verbs follow this pattern:\n\n• ich -e (ich spiele)\n• du -st (du spielst)\n• er/sie/es -t (er spielt)\n• wir -en (wir spielen)\n• ihr -t (ihr spielt)\n• sie/Sie -en (sie spielen)',
        german: 'Ich lerne, du lernst, er lernt!'
    },
    'past tense': {
        answer: 'German has two main past tenses:\n\n**Perfekt** (spoken): Ich **habe** gespielt\n**Präteritum** (written): Ich spielte\n\nMost Germans use Perfekt in everyday speech!',
        german: 'Ich habe Deutsch gelernt.'
    },
    // Common phrases
    'hello': {
        answer: 'Common German greetings:\n\n• **Hallo** - Hello (informal)\n• **Guten Morgen** - Good morning\n• **Guten Tag** - Good day\n• **Guten Abend** - Good evening\n• **Tschüss** - Bye',
        german: 'Hallo! Wie geht es dir?'
    },
    'thank you': {
        answer: 'Ways to say thank you:\n\n• **Danke** - Thanks\n• **Danke schön** - Thank you\n• **Vielen Dank** - Many thanks\n• **Danke sehr** - Thank you very much',
        german: 'Vielen Dank für Ihre Hilfe!'
    },
    // Default fallback
    'default': {
        answer: "I'm your German learning assistant! Try asking about:\n\n• Grammar (der/die/das, cases, verbs)\n• Common phrases (hello, thank you)\n• Pronunciation tips\n• Word meanings\n\nType your question and I'll help!",
        german: 'Wie kann ich dir helfen?'
    }
};

// Quick question suggestions
const QUICK_QUESTIONS = [
    { text: "How do I use der, die, das?", icon: HelpCircle },
    { text: "Explain Akkusativ case", icon: BookOpen },
    { text: "How to say hello?", icon: MessageCircle },
    { text: "Verb conjugation rules", icon: Lightbulb }
];

export function AIDoubtAssistant() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const { speak } = useTTS();

    const bg = useColorModeValue('white', 'gray.800');
    const inputBg = useColorModeValue('gray.50', 'gray.700');
    const userBubbleBg = useColorModeValue('brand.500', 'brand.400');
    const aiBubbleBg = useColorModeValue('gray.100', 'gray.700');
    const germanPhraseBg = useColorModeValue('purple.50', 'purple.900');

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Find best matching response
    const findResponse = (query) => {
        const lowerQuery = query.toLowerCase();

        for (const [key, value] of Object.entries(FAQ_RESPONSES)) {
            if (key !== 'default' && lowerQuery.includes(key)) {
                return value;
            }
        }

        // Check for partial matches
        if (lowerQuery.includes('article') || lowerQuery.includes('gender')) {
            return FAQ_RESPONSES['der die das'];
        }
        if (lowerQuery.includes('accusative') || lowerQuery.includes('direct object')) {
            return FAQ_RESPONSES['akkusativ'];
        }
        if (lowerQuery.includes('dative') || lowerQuery.includes('indirect')) {
            return FAQ_RESPONSES['dativ'];
        }
        if (lowerQuery.includes('conjugat') || lowerQuery.includes('verb')) {
            return FAQ_RESPONSES['verb conjugation'];
        }
        if (lowerQuery.includes('past') || lowerQuery.includes('perfekt')) {
            return FAQ_RESPONSES['past tense'];
        }
        if (lowerQuery.includes('hi') || lowerQuery.includes('greet')) {
            return FAQ_RESPONSES['hello'];
        }
        if (lowerQuery.includes('thank') || lowerQuery.includes('danke')) {
            return FAQ_RESPONSES['thank you'];
        }

        return FAQ_RESPONSES['default'];
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: inputValue
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI thinking delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const response = findResponse(inputValue);
        const aiMessage = {
            id: Date.now() + 1,
            type: 'ai',
            text: response.answer,
            german: response.german
        };

        setIsTyping(false);
        setMessages(prev => [...prev, aiMessage]);
    };

    const handleQuickQuestion = (question) => {
        setInputValue(question);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <Container maxW="container.md" py={4}>
            {/* Header */}
            <VStack spacing={2} mb={6} textAlign="center">
                <HStack>
                    <Icon as={Sparkles} color="purple.400" boxSize={6} />
                    <Heading size="lg">AI German Assistant</Heading>
                </HStack>
                <Text color="gray.500">Ask any question about German grammar, phrases, or pronunciation</Text>
            </VStack>

            {/* Chat Area */}
            <Card borderRadius="2xl" boxShadow="xl" bg={bg} overflow="hidden">
                <CardBody p={0}>
                    {/* Messages Container */}
                    <Box h="400px" overflowY="auto" p={4}>
                        {messages.length === 0 ? (
                            <VStack spacing={6} py={8}>
                                <Icon as={MessageCircle} boxSize={12} color="gray.300" />
                                <Text color="gray.500" textAlign="center">
                                    Start a conversation! Ask me anything about German.
                                </Text>

                                {/* Quick Questions */}
                                <VStack spacing={2} w="full">
                                    <Text fontSize="sm" fontWeight="bold" color="gray.500">
                                        Quick Questions:
                                    </Text>
                                    <Flex wrap="wrap" gap={2} justify="center">
                                        {QUICK_QUESTIONS.map((q, idx) => (
                                            <Button
                                                key={idx}
                                                size="sm"
                                                variant="outline"
                                                colorScheme="purple"
                                                borderRadius="full"
                                                leftIcon={<Icon as={q.icon} />}
                                                onClick={() => handleQuickQuestion(q.text)}
                                            >
                                                {q.text}
                                            </Button>
                                        ))}
                                    </Flex>
                                </VStack>
                            </VStack>
                        ) : (
                            <VStack spacing={4} align="stretch">
                                <AnimatePresence>
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <Flex
                                                justify={msg.type === 'user' ? 'flex-end' : 'flex-start'}
                                                gap={2}
                                            >
                                                {msg.type === 'ai' && (
                                                    <Avatar
                                                        size="sm"
                                                        bg="purple.500"
                                                        icon={<Icon as={Sparkles} color="white" boxSize={4} />}
                                                    />
                                                )}
                                                <Box
                                                    maxW="80%"
                                                    bg={msg.type === 'user' ? userBubbleBg : aiBubbleBg}
                                                    color={msg.type === 'user' ? 'white' : 'inherit'}
                                                    px={4}
                                                    py={3}
                                                    borderRadius="2xl"
                                                    borderTopRightRadius={msg.type === 'user' ? 'sm' : '2xl'}
                                                    borderTopLeftRadius={msg.type === 'ai' ? 'sm' : '2xl'}
                                                >
                                                    <Text whiteSpace="pre-line" fontSize="sm">
                                                        {msg.text}
                                                    </Text>

                                                    {/* German example with TTS */}
                                                    {msg.german && (
                                                        <HStack
                                                            mt={3}
                                                            p={2}
                                                            bg={germanPhraseBg}
                                                            borderRadius="lg"
                                                            spacing={2}
                                                        >
                                                            <IconButton
                                                                icon={<Volume2 size={16} />}
                                                                size="xs"
                                                                colorScheme="purple"
                                                                variant="ghost"
                                                                onClick={() => speak(msg.german)}
                                                                aria-label="Listen"
                                                            />
                                                            <Text fontSize="sm" fontStyle="italic" color="purple.600">
                                                                {msg.german}
                                                            </Text>
                                                        </HStack>
                                                    )}
                                                </Box>
                                            </Flex>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <Flex gap={2}>
                                        <Avatar
                                            size="sm"
                                            bg="purple.500"
                                            icon={<Icon as={Sparkles} color="white" boxSize={4} />}
                                        />
                                        <Box bg={aiBubbleBg} px={4} py={3} borderRadius="2xl">
                                            <HStack spacing={1}>
                                                {[0, 1, 2].map((i) => (
                                                    <Box
                                                        key={i}
                                                        as={motion.div}
                                                        w={2}
                                                        h={2}
                                                        bg="gray.400"
                                                        borderRadius="full"
                                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                                        transition={{
                                                            duration: 0.8,
                                                            repeat: Infinity,
                                                            delay: i * 0.2
                                                        }}
                                                    />
                                                ))}
                                            </HStack>
                                        </Box>
                                    </Flex>
                                )}

                                <div ref={messagesEndRef} />
                            </VStack>
                        )}
                    </Box>

                    <Divider />

                    {/* Input Area */}
                    <Box p={4} bg={inputBg}>
                        <HStack>
                            {messages.length > 0 && (
                                <IconButton
                                    icon={<RefreshCw size={18} />}
                                    onClick={clearChat}
                                    variant="ghost"
                                    colorScheme="gray"
                                    aria-label="Clear chat"
                                    size="sm"
                                />
                            )}
                            <InputGroup size="lg">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask about German grammar, phrases..."
                                    bg={bg}
                                    borderRadius="xl"
                                    pr={12}
                                    _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px purple' }}
                                />
                                <InputRightElement>
                                    <IconButton
                                        icon={<Send size={18} />}
                                        onClick={handleSend}
                                        colorScheme="purple"
                                        size="sm"
                                        isRound
                                        isDisabled={!inputValue.trim()}
                                        aria-label="Send"
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </HStack>
                    </Box>
                </CardBody>
            </Card>

            {/* Info Note */}
            <Text fontSize="xs" color="gray.400" textAlign="center" mt={4}>
                💡 Tip: Click the speaker icon to hear German pronunciations
            </Text>
        </Container>
    );
}
