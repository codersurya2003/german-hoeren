import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  HStack,
  VStack,
  SimpleGrid,
  useToast,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Calendar,
  Zap,
  Play,
  Award,
  BookOpen,
  Settings,
  MoreHorizontal,
  LogOut,
  User,
  Sparkles,
  Flame,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "./contexts/AuthContext";
import { useFirebaseProgress } from "./hooks/useFirebaseProgress";

import { VoiceStudio } from "./components/VoiceStudio";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { ExamMode } from "./components/ExamMode";
import { AuthModal } from "./components/AuthModal";
import { SocialHub } from "./components/SocialHub";
import { WordCard } from "./components/WordCard"; // Import WordCard
import { getDailyWords } from './data/words'; // Import data source

// Chakra-motion integration
const MotionBox = motion(Box);

const App = () => {
  const [view, setView] = useState("daily5");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [dailyWords, setDailyWords] = useState(() => getDailyWords());
  const { currentUser, logout } = useAuth();
  const { userData } = useFirebaseProgress();
  const toast = useToast();

  // Load words only once on mount
  // useEffect(() => {
  //   setDailyWords(getDailyWords());
  // }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const displayXp = userData?.xp || 0;
  const displayStreak = userData?.streak || 0;

  const bg = useColorModeValue("gray.50", "gray.900");
  const headerBg = useColorModeValue("white", "gray.800");

  const mainNavItems = [
    { id: "daily5", label: "Daily 5", icon: Calendar, color: "blue" },
    { id: "voiceStudio", label: "Voice Studio", icon: Mic, color: "red" },
    { id: "exam", label: "Exam Mode", icon: Zap, color: "purple" },
    { id: "progress", label: "Progress", icon: Award, color: "green" },
    { id: "social", label: "Social", icon: User, color: "pink" },
  ];

  return (
    <Box minH="100vh" bg={bg} pb={20}>
      {/* Sticky Header */}
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={100}
        bg={headerBg}
        boxShadow="sm"
        borderBottomWidth="1px"
        borderColor="gray.200"
        py={4}
      >
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            {/* Logo Section */}
            <HStack spacing={3}>
              <Flex
                w={10}
                h={10}
                align="center"
                justify="center"
                bg="brand.500"
                color="white"
                borderRadius="lg"
                fontWeight="black"
                fontSize="xl"
              >
                D
              </Flex>
              <Box>
                <Heading size="md" color="gray.700">
                  Deutsch<Text as="span" color="brand.500">Hören</Text>
                </Heading>
                <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="wide" textTransform="uppercase">
                  Learn German Daily
                </Text>
              </Box>
            </HStack>

            {/* User Stats & Menu */}
            <HStack spacing={4}>
              {/* XP Badge */}
              <Badge
                display="flex"
                alignItems="center"
                px={3}
                py={1}
                borderRadius="full"
                colorScheme="brand"
                variant="subtle"
              >
                <Icon as={Sparkles} mr={1} />
                <Text fontWeight="bold">{displayXp.toLocaleString()} XP</Text>
              </Badge>

              {/* Streak Badge */}
              {displayStreak > 0 && (
                <Badge
                  display="flex"
                  alignItems="center"
                  px={3}
                  py={1}
                  borderRadius="full"
                  colorScheme="accent"
                  variant="subtle"
                >
                  <Icon as={Flame} mr={1} />
                  <Text fontWeight="bold">{displayStreak} Day Streak</Text>
                </Badge>
              )}

              {/* User Menu */}
              {currentUser ? (
                <Menu>
                  <MenuButton as={Button} variant="ghost" rightIcon={<ChevronDown size={16} />}>
                    <HStack>
                      <Avatar
                        size="sm"
                        name={currentUser.displayName}
                        src={currentUser.photoURL}
                        borderWidth="2px"
                        borderColor="brand.500"
                      />
                      <Box textAlign="left" display={{ base: "none", md: "block" }}>
                        <Text fontSize="sm" fontWeight="bold">
                          {currentUser.displayName || "Learner"}
                        </Text>
                      </Box>
                    </HStack>
                  </MenuButton>
                  <MenuList>
                    <Box px={3} py={2}>
                      <Text fontSize="sm" color="gray.500">{currentUser.email}</Text>
                    </Box>
                    <MenuItem icon={<User size={16} />} onClick={() => setView("progress")}>
                      Profile
                    </MenuItem>
                    <MenuItem icon={<Settings size={16} />}>Settings</MenuItem>
                    <MenuItem icon={<LogOut size={16} />} onClick={handleLogout} color="red.500">
                      Sign Out
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Button colorScheme="brand" onClick={() => setShowAuthModal(true)}>
                  Sign In
                </Button>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Navigation */}
      <Container maxW="container.lg" mt={8}>
        <Flex justify="center" wrap="wrap" gap={4} mb={10}>
          {mainNavItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => setView(item.id)}
              leftIcon={<Icon as={item.icon} />}
              variant={view === item.id ? "solid" : "ghost"}
              colorScheme="brand"
              size="lg"
              borderRadius="xl"
              px={6}
            >
              {item.label}
            </Button>
          ))}
        </Flex>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <MotionBox
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === "daily5" && (
              <VStack spacing={8}>
                <Box textAlign="center" mb={4}>
                  <Heading as="h2" size="xl" mb={2} color="brand.600">Daily 5 Words</Heading>
                  <Text color="gray.600">Master these words to build your vocabulary foundation.</Text>
                </Box>

                {/* Daily 5 Words Content */}
                {/* Daily 5 Words Content */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
                  {dailyWords.map((word, index) => (
                    <motion.div
                      key={word.german}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{ width: '100%' }}
                    >
                      {/* Temporary wrapper until WordCard is migrated */}
                      <WordCard word={word} />
                    </motion.div>
                  ))}
                </SimpleGrid>

              </VStack>
            )}

            {view === "voiceStudio" && <VoiceStudio />}
            {view === "exam" && <ExamMode />}
            {view === "progress" && <ProgressDashboard />}
            {view === "social" && <SocialHub />}
          </MotionBox>
        </AnimatePresence>
      </Container>


      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </Box>
  );
};

export default App;
