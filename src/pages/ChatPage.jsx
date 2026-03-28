import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Loader2, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import GlassCard from '../components/GlassCard';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';

const ChatPage = () => {
  const { t, currentLanguage } = useLanguage();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('chat_welcome') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';

      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
    }
  }, [currentLanguage]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Update welcome message if language changes and no conversation has started
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([{ role: 'assistant', content: t('chat_welcome') }]);
    }
  }, [currentLanguage]);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    if (!text) return;
    
    const cleanedText = text.replace(/[*#_`]/g, '');
    const isHindi = /[\u0900-\u097F]/.test(text);
    const langCode = isHindi ? 'hi-IN' : 'en-IN';
    console.log(`TTS: Detected ${isHindi ? 'Hindi' : 'English'}, using ${langCode}`);
    
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    utterance.lang = langCode;

    const voices = window.speechSynthesis.getVoices();
    
    // Target female Indian voices
    let preferredVoice = null;
    if (isHindi) {
      // Prioritize Google Hindi or common female Hindi names
      preferredVoice = voices.find(v => v.lang === 'hi-IN' && (v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Kalpana')));
      if (!preferredVoice) preferredVoice = voices.find(v => v.lang === 'hi-IN');
    } else {
      // Prioritize Google India English or common female Indian English names
      preferredVoice = voices.find(v => (v.lang === 'en-IN' || v.lang === 'en_IN') && (v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Neerja') || v.name.includes('Heera')));
      if (!preferredVoice) preferredVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en_IN'));
    }

    if (preferredVoice) utterance.voice = preferredVoice;
    
    // Adjust rate for clearer Indian accent perception
    utterance.rate = 1.0;
    utterance.pitch = 1.1; // Slightly higher pitch for female voice
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    stopSpeaking();
    if (isRecording) recognitionRef.current.stop();

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/chat', {
        messages: [...history, userMessage],
        language: currentLanguage
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const { text } = response.data;
      setMessages((prev) => [...prev, { role: 'assistant', content: text }]);
      
      // Automatic voice output
      speak(text);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto h-[75vh] flex flex-col">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold uppercase">{t('hero_title_part1')} <span className="text-gradient">{t('hero_title_part2')}</span></h1>
            <p className="text-gray-400">{t('chat_sub')}</p>
          </div>
          {isSpeaking && (
            <button 
              onClick={stopSpeaking}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-pulse"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>{t('stop_speaking')}</span>
            </button>
          )}
        </div>

        <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden border-white/5 bg-black/40">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10"
          >
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start max-w-[80%] space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-primary/20 border border-primary/30' : 'bg-purple-500/20 border border-purple-500/30'
                    }`}>
                      {msg.role === 'user' ? <User className="w-6 h-6 text-primary" /> : <Bot className="w-6 h-6 text-purple-400" />}
                    </div>
                    <div className="relative group">
                      <div className={`p-4 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-primary/10 border border-primary/20 text-white rounded-tr-none' 
                          : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                      
                      {msg.role === 'assistant' && (
                        <button 
                          onClick={() => speak(msg.content)}
                          className="absolute -right-10 top-2 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 opacity-0 group-hover:opacity-100 transition-all hover:text-primary hover:bg-primary/10"
                          title={t('chat_speak_tooltip')}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 italic text-sm">
                    {t('loading')}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-white/5 backdrop-blur-md">
            <div className="relative flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('chat_placeholder')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'text-gray-400 hover:text-primary hover:bg-white/5'
                  }`}
                  title={isRecording ? "Stop Recording" : "Start Voice Input"}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-4 bg-primary rounded-xl text-white hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-primary transition-all shadow-lg shadow-primary/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    </PageLayout>
  );
};

export default ChatPage;
