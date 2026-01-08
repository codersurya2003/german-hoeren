import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, MessageCircle, Mic, Star, Clock, Globe,
    Check, X, Phone, Video, Search, Filter,
    ChevronRight, Send, Sparkles
} from 'lucide-react';
import { speakingPartners, chatRooms, conversationPrompts, sessionTypes } from '../data/socialData';

export function SocialHub() {
    const [activeTab, setActiveTab] = useState('partners'); // 'partners', 'rooms', 'session'
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    // Filter partners
    const filteredPartners = speakingPartners.filter(partner => {
        const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            partner.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesOnline = !showOnlineOnly || partner.online;
        return matchesSearch && matchesOnline;
    });

    return (
        <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center gap-2 mb-8">
                {[
                    { id: 'partners', label: 'Speaking Partners', icon: Users },
                    { id: 'rooms', label: 'Chat Rooms', icon: MessageCircle },
                    { id: 'session', label: 'Start Session', icon: Mic }
                ].map((tab) => (
                    <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all"
                        style={{
                            background: activeTab === tab.id ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${activeTab === tab.id ? 'rgba(236, 72, 153, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                            color: activeTab === tab.id ? '#EC4899' : '#94a3b8'
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </motion.button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* Speaking Partners Tab */}
                {activeTab === 'partners' && (
                    <motion.div
                        key="partners"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        {/* Search & Filter */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search by name or interests..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50"
                                />
                            </div>
                            <motion.button
                                onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium"
                                style={{
                                    background: showOnlineOnly ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                    border: `1px solid ${showOnlineOnly ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                                    color: showOnlineOnly ? '#22C55E' : '#94a3b8'
                                }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className={`w-2 h-2 rounded-full ${showOnlineOnly ? 'bg-green-400' : 'bg-gray-500'}`} />
                                Online Only
                            </motion.button>
                        </div>

                        {/* Partners Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredPartners.map((partner, index) => (
                                <motion.div
                                    key={partner.id}
                                    className="rounded-2xl p-5 cursor-pointer"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 1) 100%)',
                                        border: selectedPartner?.id === partner.id
                                            ? '2px solid rgba(236, 72, 153, 0.5)'
                                            : '2px solid rgba(255, 255, 255, 0.1)'
                                    }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.02, borderColor: 'rgba(236, 72, 153, 0.3)' }}
                                    onClick={() => setSelectedPartner(partner)}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                                                style={{ background: 'rgba(236, 72, 153, 0.1)' }}>
                                                {partner.avatar}
                                            </div>
                                            {partner.online && (
                                                <motion.div
                                                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-gray-900"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-white text-lg">{partner.name}</h3>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                                                    {partner.level}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-2 line-clamp-2">{partner.bio}</p>

                                            {/* Stats */}
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="flex items-center gap-1 text-yellow-400">
                                                    <Star size={14} fill="currentColor" />
                                                    {partner.rating}
                                                </span>
                                                <span className="flex items-center gap-1 text-gray-500">
                                                    <MessageCircle size={14} />
                                                    {partner.sessionsCompleted} sessions
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <motion.button
                                            className="p-3 rounded-xl"
                                            style={{
                                                background: partner.online ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                                color: partner.online ? '#22C55E' : '#64748b'
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {partner.online ? <Phone size={20} /> : <Clock size={20} />}
                                        </motion.button>
                                    </div>

                                    {/* Interests */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {partner.interests.map((interest) => (
                                            <span
                                                key={interest}
                                                className="text-xs px-2 py-1 rounded-full"
                                                style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}
                                            >
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {filteredPartners.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <Users size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No partners found matching your criteria</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Chat Rooms Tab */}
                {activeTab === 'rooms' && (
                    <motion.div
                        key="rooms"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {chatRooms.map((room, index) => (
                                <motion.div
                                    key={room.id}
                                    className="rounded-2xl p-6 cursor-pointer relative overflow-hidden"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 1) 100%)',
                                        border: `2px solid ${room.color}40`
                                    }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.03, borderColor: `${room.color}80` }}
                                    onClick={() => setSelectedRoom(room)}
                                >
                                    {/* Top glow */}
                                    <div className="absolute top-0 left-0 right-0 h-1"
                                        style={{ background: `linear-gradient(90deg, transparent, ${room.color}, transparent)` }} />

                                    <div className="text-4xl mb-4">{room.icon}</div>
                                    <h3 className="text-xl font-bold text-white mb-2">{room.name}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{room.description}</p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs px-2 py-1 rounded-full"
                                            style={{ background: `${room.color}20`, color: room.color }}>
                                            {room.level}
                                        </span>
                                        <span className="flex items-center gap-1 text-sm text-green-400">
                                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                            {room.activeUsers} online
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Start Session Tab */}
                {activeTab === 'session' && (
                    <motion.div
                        key="session"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        {/* Session Types */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {sessionTypes.map((type, index) => (
                                <motion.div
                                    key={type.id}
                                    className="rounded-2xl p-6 cursor-pointer"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 1) 100%)',
                                        border: '2px solid rgba(236, 72, 153, 0.2)'
                                    }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.02, borderColor: 'rgba(236, 72, 153, 0.5)' }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl">{type.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white">{type.name}</h3>
                                            <p className="text-gray-400 text-sm">{type.description}</p>
                                            <span className="text-xs text-pink-400">{type.duration}</span>
                                        </div>
                                        <ChevronRight className="text-gray-500" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Conversation Prompts */}
                        <div className="rounded-2xl p-6"
                            style={{
                                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 1) 100%)',
                                border: '2px solid rgba(255, 215, 0, 0.2)'
                            }}>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Sparkles className="text-yellow-400" />
                                Conversation Starters
                            </h3>

                            <div className="space-y-4">
                                {conversationPrompts.beginner.slice(0, 3).map((prompt, index) => (
                                    <div key={index} className="p-4 rounded-xl"
                                        style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                                                {prompt.topic}
                                            </span>
                                        </div>
                                        <p className="text-white font-medium mb-2">{prompt.prompt}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {prompt.vocabulary.map((word) => (
                                                <span key={word} className="text-xs text-gray-400 italic">
                                                    {word}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Room/Partner Modal would go here */}
        </div>
    );
}
