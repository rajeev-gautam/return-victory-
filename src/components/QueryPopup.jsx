import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Mic, MicOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import GlassCard from './GlassCard';

const QueryPopup = () => {
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // Hide on pages other than dashboard or schemes
  const visiblePages = ['/dashboard', '/schemes'];
  const isVisible = visiblePages.includes(location.pathname);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + (prev ? ' ' : '') + transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => setIsRecording(false);
      recognitionRef.current.onerror = () => setIsRecording(false);
    }
  }, [currentLanguage]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || isLoading) return;

    if (!user) {
      alert("Please login to submit a support query.");
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/queries', {
        subject,
        message
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setIsSuccess(true);
      setSubject('');
      setMessage('');
      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Query submission error:", error);
      if (error.response?.status === 401) {
        alert("Session expired or unauthorized. Please login again.");
        navigate('/login');
      } else {
        alert(t('query_error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-[180px] right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[350px] shadow-2xl"
          >
            <GlassCard className="p-0 border-primary/20 bg-slate-900/95 backdrop-blur-xl overflow-hidden">
              <div className="bg-primary/20 p-4 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <h3 className="font-bold text-white uppercase text-sm">{t('query_title')}</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5">
                {isSuccess ? (
                  <div className="py-10 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </div>
                    <p className="text-green-400 font-medium">{t('query_success')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-xs text-gray-400 italic mb-2">{t('query_subtitle')}</p>
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{t('query_label_subject')}</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={t('query_placeholder_subject')}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{t('query_label_message')}</label>
                      <div className="relative">
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={t('query_placeholder_message')}
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={toggleRecording}
                          className={`absolute bottom-2 right-2 p-1.5 rounded-lg transition-all ${
                            isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-primary hover:bg-white/5'
                          }`}
                        >
                          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {!user && (
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-4">
                        <p className="text-xs text-orange-400 font-medium text-center">
                          {currentLanguage === 'hi' 
                            ? "अपनी शिकायत या अनुरोध भेजने के लिए कृपया लॉग इन करें।" 
                            : "Please login to submit your grievance or support request."}
                        </p>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isLoading || (!user && isOpen)}
                      className={`w-full ${!user ? 'bg-gray-600 cursor-not-allowed' : 'bg-primary hover:bg-blue-600'} text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2`}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : !user ? (
                        <span>{currentLanguage === 'hi' ? "लॉगिन करें" : "Login to Submit"}</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{t('query_btn_send')}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default QueryPopup;
