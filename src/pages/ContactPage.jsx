import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';

const ContactPage = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await api.post('/contact', formData);
      if (response.status === 200) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Submission failed', error);
      const detail = error.response?.data?.detail || 'Failed to send message. Check server logs.';
      setErrorMsg(detail);
    }
  };

  return (
    <PageLayout title={t('contact_title')}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">{t('contact_get_in_touch')}</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                {t('contact_desc')}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start group">
                <div className="bg-primary/10 p-4 rounded-2xl mr-6 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">{t('contact_email_us')}</h4>
                  <p className="text-gray-400">sgrid.work@gmail.com</p>
                  <p className="text-sm text-primary/60">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="bg-primary/10 p-4 rounded-2xl mr-6 group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">{t('contact_call_us')}</h4>
                  <p className="text-gray-400">+91 1800-123-4567</p>
                  <p className="text-sm text-primary/60">Mon-Sat, 9AM-6PM IST</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="bg-primary/10 p-4 rounded-2xl mr-6 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">{t('contact_office')}</h4>
                  <p className="text-gray-400">123 GovTech Plaza, Innovation Hub</p>
                  <p className="text-gray-400 text-sm">New Delhi, India 110001</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10">
            {isSubmitted ? (
              <div className="text-center py-20 space-y-6 animate-fadeIn">
                <div className="bg-green-500/10 p-6 rounded-full w-fit mx-auto">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-white">{t('contact_msg_sent')}</h3>
                <p className="text-gray-400 text-lg">
                  {t('contact_msg_sent_desc').replace('{email}', 'sgrid.work@gmail.com')}
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="px-8 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all font-semibold"
                >
                  {t('contact_btn_another')}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm mb-4">
                    <strong>Error: </strong> {errorMsg}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-400">{t('contact_full_name')}</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-400">{t('contact_email_addr')}</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400">{t('contact_subject')}</label>
                    <input 
                      type="text" 
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400">{t('contact_message')}</label>
                    <textarea 
                      name="message"
                      required
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message here..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary py-4 rounded-xl text-white font-bold text-lg hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center justify-center shadow-lg shadow-primary/25 group"
                  >
                    <span>{t('contact_btn_send')}</span>
                    <Send className="w-5 h-5 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ContactPage;
