import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, Send, Sparkles, Volume2, Lightbulb,
    BookOpen, HelpCircle, RefreshCw, AlertCircle
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
    Divider,
    Alert,
    AlertIcon,
    AlertDescription
} from '@chakra-ui/react';
import { useTTS } from '../hooks/useTTS';
import { askGemini, isGeminiConfigured } from '../services/gemini';

// Quick question suggestions
const QUICK_QUESTIONS = [
    { text: "How do I use der, die, das?", icon: HelpCircle },
    { text: "Explain Akkusativ case", icon: BookOpen },
    { text: "How to say hello in German?", icon: MessageCircle },
    { text: "Verb conjugation rules", icon: Lightbulb }
];

export function AIDoubtAssistant() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const { speak } = useTTS();

    const bg = useColorModeValue('white', 'gray.800');
    const inputBg = useColorModeValue('gray.50', 'gray.700');
    const userBubbleBg = useColorModeValue('brand.500', 'brand.400');
    const aiBubbleBg = useColorModeValue('gray.100', 'gray.700');
    const germanPhraseBg = useColorModeValue('purple.50', 'purple.900');

    // Check if Gemini is configured
    const geminiConfigured = isGeminiConfigured();

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        setError(null);

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: inputValue
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Get AI response from Gemini
            const response = await askGemini(inputValue, messages);

            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                text: response.text,
                german: response.germanExample
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error('AI Error:', err);
            setError(err.message || 'Failed to get AI response. Please try again.');

            // Remove user message if AI failed
            setMessages(prev => prev.filter(m => m.id !== userMessage.id));
            setInputValue(userMessage.text); // Restore input
        } finally {
            setIsTyping(false);
        }
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
        setError(null);
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

            {/* Configuration Warning */}
            {!geminiConfigured && (
                <Alert status="warning" borderRadius="xl" mb={4}>
                    <AlertIcon />
                    <AlertDescription fontSize="sm">
                        AI is not configured. Add VITE_GEMINI_API_KEY to your .env file to enable AI features.
                    </AlertDescription>
                </Alert>
            )}

            {/* Error Alert */}
            {error && (
                <Alert status="error" borderRadius="xl" mb={4}>
                    <AlertIcon />
                    <AlertDescription fontSize="sm">{error}</AlertDescription>
                </Alert>
            )}

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
