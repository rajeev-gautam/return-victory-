import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, MessageSquare, Send, Loader2, Volume2, VolumeX } from 'lucide-react';
import { getGroqChatCompletion } from '../services/groq';
import { useLanguage } from '../contexts/LanguageContext';

const FloatingBot = () => {
  const { t, currentLanguage } = useLanguage();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Hide on AI Chat page as that page already has a chatbot
  const isHidden = location.pathname === '/chat';
  const [showHelp, setShowHelp] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('chat_welcome') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef(null);

  // Update welcome message if language changes and no conversation has started
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([{ role: 'assistant', content: t('chat_welcome') }]);
    }
  }, [currentLanguage]);

  // Pre-load voices for TTS
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Cleanup: Ensure sound stops if component unmounts
    return () => window.speechSynthesis.cancel();
  }, []);

  // Free built-in Speech Synthesis
  const speak = (text) => {
    window.speechSynthesis.cancel();
    if (!text) {
      setIsSpeaking(false);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onstart = () => {
      console.log("Speech started");
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      console.log("Speech ended");
      setIsSpeaking(false);
    };
    utterance.onerror = (e) => {
      console.error("Speech error:", e);
      setIsSpeaking(false);
    };
    
    const voices = window.speechSynthesis.getVoices();
    const langCode = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
    
    // Find preferred voice (try to get female one for 'helper' feel if possible)
    let preferredVoice = voices.find(v => v.lang.includes(langCode) && (v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Microsoft')));
    if (!preferredVoice) preferredVoice = voices.find(v => v.lang.includes(langCode));
    if (!preferredVoice) preferredVoice = voices[0];
    
    if (preferredVoice) utterance.voice = preferredVoice;
    
    // Adjust rate for clarity
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Speak
    window.speechSynthesis.speak(utterance);
    
    // Fallback: If it says it's speaking but really isn't (Chrome bug)
    setTimeout(() => {
      if (!window.speechSynthesis.speaking) {
        setIsSpeaking(false);
      }
    }, 100);
  };

  const stopSpeaking = (e) => {
    if (e) e.stopPropagation();
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowHelp(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Use a ref to always have the latest messages for the external event listener
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const handleExternalMsg = (e) => {
      const { message } = e.detail;
      if (message) {
        setIsOpen(true);
        setShowHelp(false);
        // Delay to allow isOpen to animate if needed, but use latest messagesRef
        setTimeout(() => {
          sendMessage(message, messagesRef.current);
        }, 100);
      }
    };
    window.addEventListener('openChatWithMsg', handleExternalMsg);
    return () => window.removeEventListener('openChatWithMsg', handleExternalMsg);
  }, []); 

  const sendMessage = async (text, customHistory = null) => {
    if (!text.trim() || isLoading) return;

    const userMsg = { role: 'user', content: text };
    
    // Determine history: if customHistory is provided (from the event listener), use it.
    // Otherwise use the current 'messages' state from this render cycle.
    const baseHistory = customHistory || messages;
    const newMessages = [...baseHistory, userMsg];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    stopSpeaking();

    try {
      // Map to clean structure for API
      const apiHistory = newMessages.map(m => ({ 
        role: m.role || 'user', 
        content: m.content || '' 
      }));
      
      const response = await getGroqChatCompletion(apiHistory, currentLanguage);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      speak(response);
    } catch (error) {
      console.error("FloatingBot error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    sendMessage(input);
  };

  if (isHidden) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-80 h-96 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-primary/20 border-b border-white/10 flex justify-between items-center text-white">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm uppercase">{t('hero_title_part1')} AI</span>
              </div>
              <div className="flex items-center space-x-3">
                {isSpeaking && (
                  <button 
                    onClick={stopSpeaking} 
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-500 animate-pulse hover:bg-red-500/40 transition-all border border-red-500/30" 
                    title="Stop speaking"
                  >
                    <VolumeX className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => { setIsOpen(false); stopSpeaking(); }} className="hover:text-primary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="relative group max-w-[80%]">
                    <div className={`p-3 rounded-xl text-sm ${
                      m.role === 'user' ? 'bg-primary/20 text-white rounded-tr-none' : 'bg-white/5 text-gray-300 rounded-tl-none'
                    }`}>
                      {m.content}
                    </div>
                    {m.role === 'assistant' && (
                      <button 
                        onClick={() => speak(m.content)}
                        className="absolute -right-7 top-1 p-1 rounded-full bg-white/5 border border-white/10 text-gray-400 opacity-0 group-hover:opacity-100 transition-all hover:text-primary hover:bg-primary/10"
                        title="Speak message"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-xl rounded-tl-none text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('chat_placeholder')}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-blue-400 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelp && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-20 right-0 py-2 px-4 bg-primary text-white text-sm font-medium rounded-xl rounded-br-none shadow-xl whitespace-nowrap flex items-center space-x-2"
          >
            <Bot className="w-4 h-4" />
            <span>{t('hero_badge')}?</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowHelp(false);
              }}
              className="ml-1 hover:text-white/70"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setShowHelp(false);
          if (isOpen) stopSpeaking();
        }}
        className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-lg animate-float-slow shadow-primary/30"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
      </motion.button>
    </div>
  );
};

export default FloatingBot;
