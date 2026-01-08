import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Chrome, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AuthModal({ isOpen, onClose }) {
    const [mode, setMode] = useState('signin'); // 'signin', 'signup', 'reset'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const { signInWithGoogle, signInWithEmail, createAccount, resetPassword, error } = useAuth();

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

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="w-full max-w-md rounded-3xl p-8 relative"
                    style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%)',
                        border: '2px solid rgba(255, 215, 0, 0.2)'
                    }}
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 50 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl font-black"
                            style={{
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                color: '#000'
                            }}
                        >
                            D
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white">
                            {mode === 'signin' && 'Welcome Back!'}
                            {mode === 'signup' && 'Create Account'}
                            {mode === 'reset' && 'Reset Password'}
                        </h2>
                        <p className="text-gray-400 mt-1">
                            {mode === 'signin' && 'Sign in to continue learning German'}
                            {mode === 'signup' && 'Start your German learning journey'}
                            {mode === 'reset' && 'We\'ll send you a reset link'}
                        </p>
                    </div>

                    {/* Back button for reset mode */}
                    {mode === 'reset' && (
                        <button
                            onClick={() => setMode('signin')}
                            className="flex items-center gap-2 text-gray-400 mb-6 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to sign in
                        </button>
                    )}

                    {/* Error/Success Message */}
                    {(error || message) && (
                        <motion.div
                            className="mb-4 p-3 rounded-xl text-sm"
                            style={{
                                background: message?.type === 'success'
                                    ? 'rgba(34, 197, 94, 0.2)'
                                    : 'rgba(239, 68, 68, 0.2)',
                                color: message?.type === 'success' ? '#22C55E' : '#EF4444'
                            }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {message?.text || error}
                        </motion.div>
                    )}

                    {/* Google Sign In - Only show on signin/signup */}
                    {mode !== 'reset' && (
                        <>
                            <motion.button
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold mb-4 transition-all"
                                style={{
                                    background: '#fff',
                                    color: '#000'
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Continue with Google
                                    </>
                                )}
                            </motion.button>

                            {/* Divider */}
                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="text-gray-500 text-sm">or</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>
                        </>
                    )}

                    {/* Email Form */}
                    <form onSubmit={
                        mode === 'signin' ? handleEmailSignIn :
                            mode === 'signup' ? handleCreateAccount :
                                handleResetPassword
                    }>
                        {/* Display Name - Only for signup */}
                        {mode === 'signup' && (
                            <div className="mb-4">
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Display Name"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div className="mb-4">
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
                                />
                            </div>
                        </div>

                        {/* Password - Not for reset */}
                        {mode !== 'reset' && (
                            <div className="mb-6">
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Forgot Password - Only on signin */}
                        {mode === 'signin' && (
                            <div className="text-right mb-6">
                                <button
                                    type="button"
                                    onClick={() => setMode('reset')}
                                    className="text-sm text-yellow-400 hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-xl font-bold text-black transition-all"
                            style={{
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin mx-auto" />
                            ) : (
                                <>
                                    {mode === 'signin' && 'Sign In'}
                                    {mode === 'signup' && 'Create Account'}
                                    {mode === 'reset' && 'Send Reset Link'}
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Toggle Mode */}
                    {mode !== 'reset' && (
                        <p className="text-center mt-6 text-gray-400">
                            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                                className="text-yellow-400 font-semibold hover:underline"
                            >
                                {mode === 'signin' ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
