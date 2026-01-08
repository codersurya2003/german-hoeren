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
      <header className="flex justify-between items-center py-6 mb-8 relative z-10">
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
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* XP Badge */}
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles size={16} className="text-purple-400" />
            <span className="text-purple-400 font-bold">{displayXp.toLocaleString()} XP</span>
          </motion.div>

          {/* Streak Badge */}
          {displayStreak > 0 && (
            <motion.div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{
                background: 'rgba(249, 115, 22, 0.15)',
                border: '1px solid rgba(249, 115, 22, 0.3)'
              }}
              whileHover={{ scale: 1.05 }}
              animate={{
                boxShadow: [
                  '0 0 10px rgba(249, 115, 22, 0.2)',
                  '0 0 20px rgba(249, 115, 22, 0.4)',
                  '0 0 10px rgba(249, 115, 22, 0.2)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame size={16} className="text-orange-400" />
              <span className="text-orange-400 font-bold">{displayStreak}</span>
            </motion.div>
          )}

          {/* User Menu or Sign In */}
          {currentUser ? (
            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                whileHover={{ scale: 1.02 }}
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <User size={16} className="text-yellow-400" />
                  </div>
                )}
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                />
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    className="absolute top-full mt-2 right-0 w-48 rounded-xl overflow-hidden z-50"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)'
                    }}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  >
                    <div className="p-4 border-b border-white/10">
                      <p className="font-semibold text-white truncate">
                        {currentUser.displayName || 'German Learner'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-400 hover:bg-white/5 hover:text-red-400 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 rounded-xl font-semibold text-black"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          )}
        </motion.div>
      </header>

      {/* Navigation */}
      <motion.nav
        className="flex flex-wrap justify-center gap-2 mb-10 relative z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {mainNavItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setView(item.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all relative overflow-hidden"
            style={{
              background: view === item.id ? `${viewInfo[item.id].color}15` : 'rgba(255, 255, 255, 0.05)',
              color: view === item.id ? viewInfo[item.id].color : '#94a3b8',
              border: view === item.id
                ? `1px solid ${viewInfo[item.id].color}40`
                : '1px solid rgba(255, 255, 255, 0.1)'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <item.icon size={18} />
            <span className="font-semibold">{item.label}</span>
          </motion.button>
        ))}

        {/* More dropdown */}
        <div className="relative">
          <motion.button
            onClick={() => setShowMoreNav(!showMoreNav)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all"
            style={{
              background: moreNavItems.some(i => i.id === view)
                ? `${viewInfo[view]?.color || '#FFD700'}15`
                : 'rgba(255, 255, 255, 0.05)',
              color: moreNavItems.some(i => i.id === view)
                ? viewInfo[view]?.color || '#FFD700'
                : '#94a3b8',
              border: moreNavItems.some(i => i.id === view)
                ? `1px solid ${viewInfo[view]?.color || '#FFD700'}40`
                : '1px solid rgba(255, 255, 255, 0.1)'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-semibold">More</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${showMoreNav ? 'rotate-180' : ''}`}
            />
          </motion.button>

          <AnimatePresence>
            {showMoreNav && (
              <motion.div
                className="absolute top-full mt-2 right-0 rounded-xl overflow-hidden z-50"
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)'
                }}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
              >
                {moreNavItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setView(item.id);
                      setShowMoreNav(false);
                    }}
                    className="flex items-center gap-3 px-5 py-3 w-full text-left transition-all"
                    style={{
                      background: view === item.id ? `${viewInfo[item.id].color}15` : 'transparent',
                      color: view === item.id ? viewInfo[item.id].color : '#94a3b8'
                    }}
                    whileHover={{ background: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <item.icon size={18} />
                    <span className="font-medium whitespace-nowrap">{item.label}</span>
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
