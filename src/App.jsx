import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen, Headphones, Trophy, Sparkles, Zap, Mic,
  BarChart3, Award, Flame, ChevronDown, User, LogOut
} from 'lucide-react';
import { WordCard } from './components/WordCard';
import { ExamMode } from './components/ExamMode';
import { VoiceStudio } from './components/VoiceStudio';
import { ProgressDashboard } from './components/ProgressDashboard';
import { DailyChallenge } from './components/DailyChallenge';
import { Leaderboard } from './components/Leaderboard';
import { AuthModal } from './components/AuthModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useFirebaseProgress } from './hooks/useFirebaseProgress';
import { getDailyWords } from './data/words';

function AppContent() {
  const [view, setView] = useState('daily');
  const [showMoreNav, setShowMoreNav] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Use useState with lazy initialization to keep words stable across re-renders
  const [dailyWords] = useState(() => getDailyWords());
  const { currentUser, logout } = useAuth();
  const { xp, streak, recordPractice } = useFirebaseProgress();

  // Fallback to localStorage for non-authenticated users
  const displayXp = currentUser ? xp : parseInt(localStorage.getItem('deutschhoren_xp') || '0', 10);
  const displayStreak = currentUser ? streak : parseInt(localStorage.getItem('deutschhoren_streak') || '0', 10);

  // Record practice when user visits
  useEffect(() => {
    if (currentUser) {
      recordPractice();
    }
  }, [currentUser, recordPractice]);

  // Navigation items
  const mainNavItems = [
    { id: 'daily', label: 'Daily 5', icon: BookOpen },
    { id: 'voice', label: 'Voice Studio', icon: Mic },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
  ];

  const moreNavItems = [
    { id: 'exam', label: 'Hören Exam', icon: Headphones },
    { id: 'challenge', label: 'Daily Challenge', icon: Zap },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  // View titles and subtitles
  const viewInfo = {
    daily: {
      title: "Today's Words",
      subtitle: 'Master these 5 words to expand your vocabulary',
      badge: 'New words for today',
      badgeIcon: Sparkles,
      color: '#FFD700'
    },
    voice: {
      title: 'Voice Studio',
      subtitle: 'Practice pronunciation and get instant feedback',
      badge: 'Practice speaking',
      badgeIcon: Mic,
      color: '#22C55E'
    },
    progress: {
      title: 'Your Progress',
      subtitle: 'Track your learning journey and achievements',
      badge: 'Stats & achievements',
      badgeIcon: BarChart3,
      color: '#8B5CF6'
    },
    exam: {
      title: 'Hören Exam',
      subtitle: 'Listening comprehension & Grammar exercises',
      badge: 'Test your knowledge',
      badgeIcon: Headphones,
      color: '#3B82F6'
    },
    challenge: {
      title: 'Daily Challenge',
      subtitle: 'Complete today\'s challenge to earn bonus XP',
      badge: 'Bonus XP available',
      badgeIcon: Zap,
      color: '#F59E0B'
    },
    leaderboard: {
      title: 'Leaderboard',
      subtitle: 'See how you rank among other learners',
      badge: 'Weekly rankings',
      badgeIcon: Trophy,
      color: '#EF4444'
    }
  };

  const currentView = viewInfo[view];

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 2 === 0 ? 'rgba(255, 215, 0, 0.3)' : 'rgba(221, 0, 0, 0.2)',
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header
        className="sticky top-0 flex justify-between items-center py-6 px-4 mb-8 relative z-50 rounded-2xl"
        style={{
          backdropFilter: 'blur(20px)',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-black font-black text-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                boxShadow: '0 8px 32px rgba(255, 215, 0, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3)'
              }}
              animate={{
                boxShadow: [
                  '0 8px 32px rgba(255, 215, 0, 0.4)',
                  '0 8px 48px rgba(255, 215, 0, 0.6)',
                  '0 8px 32px rgba(255, 215, 0, 0.4)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              D
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ x: '-100%', opacity: 0.3 }}
                animate={{ x: '200%' }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </motion.div>
          </motion.div>

          {/* Brand Text */}
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #FFD700 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Deutsch<span style={{ color: '#FFD700', WebkitTextFillColor: '#FFD700' }}>Hören</span>
            </h1>
            <p className="text-xs text-gray-500 tracking-wider uppercase">Learn German Daily</p>
          </div>
        </motion.div>

        {/* Stats & User Menu */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* XP Badge */}
          <motion.div
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(139, 92, 246, 0.4)',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 6px 25px rgba(139, 92, 246, 0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles size={18} className="text-purple-400" />
            <span className="text-purple-300 font-bold text-lg">{displayXp.toLocaleString()}</span>
            <span className="text-purple-400/70 text-sm font-medium">XP</span>
          </motion.div>

          {/* Streak Badge */}
          {displayStreak > 0 && (
            <motion.div
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(249, 115, 22, 0.4)',
                boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 6px 25px rgba(249, 115, 22, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: [
                  '0 4px 20px rgba(249, 115, 22, 0.3)',
                  '0 6px 30px rgba(249, 115, 22, 0.5)',
                  '0 4px 20px rgba(249, 115, 22, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame size={18} className="text-orange-400" />
              <span className="text-orange-300 font-bold text-lg">{displayStreak}</span>
              <span className="text-orange-400/70 text-sm font-medium">Day{displayStreak !== 1 ? 's' : ''}</span>
            </motion.div>
          )}

          {/* User Menu or Sign In */}
          {currentUser ? (
            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 6px 25px rgba(255, 215, 0, 0.3)',
                  borderColor: 'rgba(255, 215, 0, 0.5)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                {currentUser.photoURL ? (
                  <div
                    className="w-10 h-10 rounded-full p-0.5"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    }}
                  >
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0.1) 100%)',
                      border: '2px solid rgba(255, 215, 0, 0.5)'
                    }}
                  >
                    <User size={20} className="text-yellow-400" />
                  </div>
                )}
                <ChevronDown
                  size={18}
                  className="text-gray-300 transition-transform"
                  style={{
                    transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    className="absolute top-full mt-3 right-0 w-56 rounded-2xl overflow-hidden z-50"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255, 215, 0, 0.2)',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.1)'
                    }}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  >
                    <div className="p-5 border-b border-white/10">
                      <p className="font-bold text-white truncate text-base mb-1">
                        {currentUser.displayName || 'German Learner'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                    <motion.button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-left text-gray-400 transition-colors"
                      whileHover={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#EF4444'
                      }}
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Sign Out</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-2.5 rounded-2xl font-bold text-black"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)'
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 6px 30px rgba(255, 215, 0, 0.5)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          )}
        </motion.div>
      </header>

      {/* Navigation */}
      <motion.nav
        className="flex flex-wrap justify-center gap-3 mb-10 relative z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {mainNavItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setView(item.id)}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl transition-all relative overflow-hidden font-semibold"
            style={{
              background: view === item.id
                ? `linear-gradient(135deg, ${viewInfo[item.id].color}20 0%, ${viewInfo[item.id].color}10 100%)`
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(10px)',
              color: view === item.id ? viewInfo[item.id].color : '#94a3b8',
              border: view === item.id
                ? `2px solid ${viewInfo[item.id].color}60`
                : '2px solid rgba(255, 255, 255, 0.1)',
              boxShadow: view === item.id
                ? `0 4px 20px ${viewInfo[item.id].color}30`
                : '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: view === item.id
                ? `0 6px 25px ${viewInfo[item.id].color}40`
                : '0 4px 15px rgba(255, 255, 255, 0.1)'
            }}
            whileTap={{ scale: 0.97 }}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </motion.button>
        ))}

        {/* More dropdown */}
        <div className="relative">
          <motion.button
            onClick={() => setShowMoreNav(!showMoreNav)}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl transition-all font-semibold"
            style={{
              background: moreNavItems.some(i => i.id === view)
                ? `linear-gradient(135deg, ${viewInfo[view]?.color || '#FFD700'}20 0%, ${viewInfo[view]?.color || '#FFD700'}10 100%)`
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(10px)',
              color: moreNavItems.some(i => i.id === view)
                ? viewInfo[view]?.color || '#FFD700'
                : '#94a3b8',
              border: moreNavItems.some(i => i.id === view)
                ? `2px solid ${viewInfo[view]?.color || '#FFD700'}60`
                : '2px solid rgba(255, 255, 255, 0.1)',
              boxShadow: moreNavItems.some(i => i.id === view)
                ? `0 4px 20px ${viewInfo[view]?.color || '#FFD700'}30`
                : '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: moreNavItems.some(i => i.id === view)
                ? `0 6px 25px ${viewInfo[view]?.color || '#FFD700'}40`
                : '0 4px 15px rgba(255, 255, 255, 0.1)'
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span>More</span>
            <ChevronDown
              size={18}
              className="transition-transform"
              style={{
                transform: showMoreNav ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            />
          </motion.button>

          <AnimatePresence>
            {showMoreNav && (
              <motion.div
                className="absolute top-full mt-3 right-0 w-64 rounded-2xl overflow-hidden z-50"
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                {moreNavItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setView(item.id);
                      setShowMoreNav(false);
                    }}
                    className="flex items-center gap-3.5 px-5 py-4 w-full text-left transition-all font-medium"
                    style={{
                      background: view === item.id
                        ? `linear-gradient(135deg, ${viewInfo[item.id].color}20 0%, ${viewInfo[item.id].color}10 100%)`
                        : 'transparent',
                      color: view === item.id ? viewInfo[item.id].color : '#94a3b8',
                      borderBottom: index < moreNavItems.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                    }}
                    whileHover={{
                      background: view === item.id
                        ? `linear-gradient(135deg, ${viewInfo[item.id].color}25 0%, ${viewInfo[item.id].color}15 100%)`
                        : 'rgba(255, 255, 255, 0.08)',
                      paddingLeft: '24px'
                    }}
                  >
                    <item.icon size={20} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.section
            key={view}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Section Header */}
            <div className="mb-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                style={{
                  background: `${currentView.color}15`,
                  border: `1px solid ${currentView.color}30`
                }}
              >
                <currentView.badgeIcon size={14} style={{ color: currentView.color }} />
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: currentView.color }}
                >
                  {currentView.badge}
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold mb-3"
                style={{
                  background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {currentView.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg"
                style={{ color: '#64748b' }}
              >
                {currentView.subtitle}
              </motion.p>
            </div>

            {/* View Content */}
            {view === 'daily' && (
              <>
                {/* Word Cards Grid */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.12 }
                    }
                  }}
                >
                  {dailyWords.map(word => (
                    <WordCard key={word.id} word={word} />
                  ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-14 p-8 rounded-3xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: 'radial-gradient(ellipse at 30% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 50%)'
                    }}
                  />

                  <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Mic size={20} style={{ color: '#22C55E' }} />
                        <h3 className="text-2xl font-bold" style={{ color: '#22C55E' }}>
                          Practice Pronunciation
                        </h3>
                      </div>
                      <p className="text-base" style={{ color: '#94a3b8' }}>
                        Record yourself speaking and get instant feedback on your accent.
                      </p>
                    </div>

                    <motion.button
                      onClick={() => setView('voice')}
                      className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-black transition-all whitespace-nowrap"
                      style={{
                        background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                        boxShadow: '0 8px 30px rgba(34, 197, 94, 0.4)'
                      }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: '0 12px 40px rgba(34, 197, 94, 0.5)'
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Voice Studio <Mic size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              </>
            )}

            {view === 'voice' && <VoiceStudio />}
            {view === 'progress' && <ProgressDashboard />}
            {view === 'exam' && <ExamMode />}
            {view === 'challenge' && <DailyChallenge />}
            {view === 'leaderboard' && <Leaderboard />}
          </motion.section>
        </AnimatePresence>
      </main>

      {/* Click outside to close dropdowns */}
      {(showMoreNav || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowMoreNav(false);
            setShowUserMenu(false);
          }}
        />
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
