import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User, Chrome, Loader2, ArrowLeft } from 'lucide-react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    Input,
    InputGroup,
    InputLeftElement,
    VStack,
    Text,
    useColorModeValue,
    Divider,
    HStack,
    Box,
    Alert,
    AlertIcon,
    AlertTitle,
    Link,
    Icon,
    Heading,
    Flex
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

export function AuthModal({ isOpen, onClose }) {
    const [mode, setMode] = useState('signin'); // 'signin', 'signup', 'reset'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const { signInWithGoogle, signInWithEmail, createAccount, resetPassword, error } = useAuth();

    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const googleBtnBg = useColorModeValue('white', 'gray.700');
    const googleBtnHover = useColorModeValue('gray.50', 'gray.600');
    const bannerBg = useColorModeValue('linear(to-r, brand.500, brand.400)', 'linear(to-r, brand.600, brand.500)');

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
            onClose();
        } catch (err) {
            console.error('Google sign-in error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            await signInWithEmail(email, password);
            onClose();
        } catch (err) {
            console.error('Email sign-in error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            await createAccount(email, password, displayName);
            onClose();
        } catch (err) {
            console.error('Create account error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            await resetPassword(email);
            setMessage({ type: 'success', text: 'Password reset email sent!' });
        } catch (err) {
            console.error('Password reset error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset state when closing
    const handleClose = () => {
        setMode('signin');
        setMessage(null);
        setEmail('');
        setPassword('');
        setDisplayName('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} isCentered size="md" motionPreset="slideInBottom">
            <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
            <ModalContent borderRadius="3xl" overflow="hidden" mx={4} bg={bg}>
                <Box bgGradient={bannerBg} p={8} textAlign="center" color="white" position="relative">
                    <ModalCloseButton color="white" top={4} right={4} fontSize="lg" />

                    <Flex
                        w={16}
                        h={16}
                        mx="auto"
                        mb={4}
                        bg="white"
                        borderRadius="2xl"
                        align="center"
                        justify="center"
                        color="brand.500"
                        fontSize="3xl"
                        fontWeight="black"
                        boxShadow="lg"
                    >
                        D
                    </Flex>
                    <Heading size="lg" mb={2}>
                        {mode === 'signin' && 'Welcome Back!'}
                        {mode === 'signup' && 'Create Account'}
                        {mode === 'reset' && 'Reset Password'}
                    </Heading>
                    <Text opacity={0.9}>
                        {mode === 'signin' && 'Sign in to continue learning German'}
                        {mode === 'signup' && 'Start your German learning journey'}
                        {mode === 'reset' && 'We\'ll send you a reset link'}
                    </Text>
                </Box>

                <ModalBody p={8}>
                    {/* Back button for reset mode */}
                    {mode === 'reset' && (
                        <Button
                            variant="ghost"
                            leftIcon={<ArrowLeft size={16} />}
                            onClick={() => setMode('signin')}
                            mb={4}
                            size="sm"
                        >
                            Back to sign in
                        </Button>
                    )}

                    {/* Error/Success Message */}
                    {(error || message) && (
                        <Alert
                            status={message?.type === 'success' ? 'success' : 'error'}
                            borderRadius="xl"
                            mb={6}
                            variant="subtle"
                        >
                            <AlertIcon />
                            <AlertTitle fontSize="sm">{message?.text || error}</AlertTitle>
                        </Alert>
                    )}

                    {/* Google Sign In - Only on signin/signup */}
                    {mode !== 'reset' && (
                        <>
                            <Button
                                w="full"
                                variant="outline"
                                size="lg"
                                h="56px"
                                borderRadius="xl"
                                leftIcon={
                                    !isLoading && (
                                        <svg width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                    )
                                }
                                onClick={handleGoogleSignIn}
                                isLoading={isLoading}
                                bg={googleBtnBg}
                                _hover={{ bg: googleBtnHover }}
                                mb={6}
                                borderWidth="1px"
                                borderColor={borderColor}
                                fontWeight="medium"
                            >
                                Continue with Google
                            </Button>

                            <HStack mb={6}>
                                <Divider />
                                <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
                                    or with email
                                </Text>
                                <Divider />
                            </HStack>
                        </>
                    )}

                    {/* Email Form */}
                    <form onSubmit={
                        mode === 'signin' ? handleEmailSignIn :
                            mode === 'signup' ? handleCreateAccount :
                                handleResetPassword
                    }>
                        <VStack spacing={4}>
                            {/* Display Name - Only for signup */}
                            {mode === 'signup' && (
                                <FormControl isRequired>
                                    <InputGroup size="lg">
                                        <InputLeftElement pointerEvents="none">
                                            <Icon as={User} color="gray.400" />
                                        </InputLeftElement>
                                        <Input
                                            type="text"
                                            placeholder="Display Name"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            borderRadius="xl"
                                            bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
                                            borderWidth={0}
                                            _focus={{ borderWidth: 1, borderColor: 'brand.500', bg: 'transparent' }}
                                        />
                                    </InputGroup>
                                </FormControl>
                            )}

                            {/* Email */}
                            <FormControl isRequired>
                                <InputGroup size="lg">
                                    <InputLeftElement pointerEvents="none">
                                        <Icon as={Mail} color="gray.400" />
                                    </InputLeftElement>
                                    <Input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        borderRadius="xl"
                                        bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
                                        borderWidth={0}
                                        _focus={{ borderWidth: 1, borderColor: 'brand.500', bg: 'transparent' }}
                                    />
                                </InputGroup>
                            </FormControl>

                            {/* Password - Not for reset */}
                            {mode !== 'reset' && (
                                <FormControl isRequired>
                                    <InputGroup size="lg">
                                        <InputLeftElement pointerEvents="none">
                                            <Icon as={Lock} color="gray.400" />
                                        </InputLeftElement>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            minLength={6}
                                            borderRadius="xl"
                                            bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
                                            borderWidth={0}
                                            _focus={{ borderWidth: 1, borderColor: 'brand.500', bg: 'transparent' }}
                                        />
                                    </InputGroup>
                                </FormControl>
                            )}

                            {/* Forgot Password - Only on signin */}
                            {mode === 'signin' && (
                                <Box w="full" textAlign="right">
                                    <Button
                                        variant="link"
                                        size="sm"
                                        colorScheme="brand"
                                        onClick={() => setMode('reset')}
                                        fontWeight="normal"
                                    >
                                        Forgot password?
                                    </Button>
                                </Box>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                w="full"
                                size="lg"
                                h="56px"
                                borderRadius="xl"
                                colorScheme="brand"
                                isLoading={isLoading}
                                mt={2}
                                fontSize="lg"
                            >
                                {mode === 'signin' && 'Sign In'}
                                {mode === 'signup' && 'Create Account'}
                                {mode === 'reset' && 'Send Reset Link'}
                            </Button>
                        </VStack>
                    </form>

                    {/* Toggle Mode */}
                    {mode !== 'reset' && (
                        <Text textAlign="center" mt={6} color="gray.500">
                            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                            <Link
                                color="brand.500"
                                fontWeight="semibold"
                                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                            >
                                {mode === 'signin' ? 'Sign up' : 'Sign in'}
                            </Link>
                        </Text>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
