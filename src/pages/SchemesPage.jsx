import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Info, ChevronRight, CheckCircle2, ChevronDown, Bot } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';

const MOCK_SCHEMES = [
  {
    id: 1,
    name: 'Pradhan Mantri Awas Yojana',
    name_hi: 'प्रधानमंत्री आवास योजना',
    description: 'Housing for all by 2024. Provides interest subsidy for housing loans.',
    description_hi: '2024 तक सभी के लिए आवास। आवास ऋण के लिए ब्याज सब्सिडी प्रदान करता है।',
    eligibility: 'Income below 18L, No pucca house in India',
    eligibility_hi: '18 लाख से कम आय, भारत में कोई पक्का घर नहीं',
    category: 'cat_housing',
    state: 'cat_national',
    official_url: 'https://pmay-urban.gov.in/'
  },
  {
    id: 2,
    name: 'Ayushman Bharat (PM-JAY)',
    name_hi: 'आयुष्मान भारत (PM-JAY)',
    description: 'World\'s largest health insurance scheme. 5 Lakhs cover per family per year.',
    description_hi: 'दुनिया की सबसे बड़ी स्वास्थ्य बीमा योजना। प्रति परिवार प्रति वर्ष 5 लाख का कवर।',
    eligibility: 'Listed in SECC 2011 data, Low income',
    eligibility_hi: 'SECC 2011 डेटा में सूचीबद्ध, कम आय',
    category: 'cat_healthcare',
    state: 'cat_national',
    official_url: 'https://nha.gov.in/PM-JAY'
  },
  {
    id: 3,
    name: 'PM Kisan Samman Nidhi',
    name_hi: 'पीएम किसान सम्मान निधि',
    description: 'Direct income support of 6000 per year to all landholding farmer families.',
    description_hi: 'सभी जोतदार किसान परिवारों को प्रति वर्ष 6000 की प्रत्यक्ष आय सहायता।',
    eligibility: 'Small and marginal farmers',
    eligibility_hi: 'छोटे और सीमांत किसान',
    category: 'cat_agriculture',
    state: 'cat_national',
    official_url: 'https://pmkisan.gov.in/'
  },
  {
    id: 4,
    name: 'Sukanya Samriddhi Yojana',
    name_hi: 'सुकन्या समृद्धि योजना',
    description: 'Small deposit scheme for the girl child. High interest and tax benefits.',
    description_hi: 'बालिका के लिए छोटी बचत योजना। उच्च ब्याज और कर लाभ।',
    eligibility: 'Girl child below 10 years',
    eligibility_hi: '10 वर्ष से कम उम्र की बालिका',
    category: 'cat_financial',
    state: 'cat_national',
    official_url: 'https://www.myscheme.gov.in/schemes/ssy'
  },
  {
    id: 5,
    name: 'Ladli Behna Yojana',
    name_hi: 'लाड़ली बहना योजना',
    description: 'Monthly financial assistance to women to improve their economic condition.',
    description_hi: 'महिलाओं की आर्थिक स्थिति सुधारने के लिए मासिक वित्तीय सहायता।',
    eligibility: 'Women aged 23-60, Annual income < 2.5L',
    eligibility_hi: '23-60 वर्ष की महिलाएं, वार्षिक आय < 2.5 लाख',
    category: 'cat_women',
    state: 'Madhya Pradesh',
    official_url: 'https://cmladlibahna.mp.gov.in/'
  }
];

const SchemesPage = () => {
  const { t, currentLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    occupation: '',
    state: '',
    gender: ''
  });
  const [recommended, setRecommended] = useState(MOCK_SCHEMES);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    try {
      const { getRecommendedSchemes } = await import('../services/groq');
      const results = await getRecommendedSchemes(formData, currentLanguage);
      if (results && results.length > 0) {
        setRecommended(results);
      } else {
        setRecommended(MOCK_SCHEMES);
      }
    } catch (error) {
      console.error("Search error:", error);
      setRecommended(MOCK_SCHEMES);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-1">
          <GlassCard className="sticky top-24">
            <div className="flex items-center space-x-2 mb-6">
              <Filter className="text-primary w-5 h-5" />
              <h2 className="text-xl font-bold">{t('profile_title')}</h2>
            </div>
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('label_age')}</label>
                <input 
                  type="number" 
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder={t('placeholder_age')}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('label_income')}</label>
                <input 
                  type="number" 
                  name="income"
                  min="0"
                  value={formData.income}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder={t('placeholder_income')}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('label_occupation')}</label>
                <div className="relative">
                  <select 
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a1c2e] border border-white/10 rounded-xl px-4 py-2 focus:ring-1 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#1a1c2e]">{t('select_occupation')}</option>
                    <option value="student" className="bg-[#1a1c2e]">{t('occ_student')}</option>
                    <option value="farmer" className="bg-[#1a1c2e]">{t('occ_farmer')}</option>
                    <option value="service" className="bg-[#1a1c2e]">{t('occ_service')}</option>
                    <option value="business" className="bg-[#1a1c2e]">{t('occ_business')}</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('label_state')}</label>
                <div className="relative">
                  <select 
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a1c2e] border border-white/10 rounded-xl px-4 py-2 focus:ring-1 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#1a1c2e]">{t('select_state')}</option>
                    <option value="Madhya Pradesh" className="bg-[#1a1c2e]">{t('state_mp')}</option>
                    <option value="Maharashtra" className="bg-[#1a1c2e]">{t('state_mh')}</option>
                    <option value="Delhi" className="bg-[#1a1c2e]">{t('state_dl')}</option>
                    <option value="National" className="bg-[#1a1c2e]">{t('state_all')}</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('label_gender')}</label>
                <div className="flex space-x-4 mt-2">
                  {[
                    { val: 'Male', key: 'gender_male' },
                    { val: 'Female', key: 'gender_female' },
                    { val: 'Other', key: 'gender_other' }
                  ].map(g => (
                    <label key={g.val} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="gender" 
                        value={g.val} 
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm">{t(g.key)}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <Button type="submit" className="w-full mt-4">
                {t('btn_find_schemes')}
              </Button>
            </form>
          </GlassCard>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-gray-400 animate-pulse font-medium">{t('loading')}</p>
            </div>
          ) : !hasSearched ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center opacity-50">
              <Search className="w-16 h-16 mb-4" />
              <h2 className="text-2xl font-bold">{t('schemes_search_title')}</h2>
              <p className="text-gray-400">{t('schemes_search_desc')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t('results_title')} <span className="text-gradient">{t('results_subtitle')}</span></h2>
                <span className="text-sm bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  {recommended.length} {t('schemes_results_count')}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {recommended.map((scheme, idx) => (
                    <motion.div
                      key={scheme.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <GlassCard className="group cursor-pointer hover:border-primary/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md">
                              {t(scheme.category)}
                            </span>
                            <h3 className="text-xl font-bold mt-2 group-hover:text-primary transition-colors">
                              {currentLanguage === 'hi' ? scheme.name_hi : scheme.name}
                            </h3>
                            <p className="text-gray-400 mt-2 line-clamp-2 text-sm leading-relaxed">
                              {currentLanguage === 'hi' ? scheme.description_hi : scheme.description}
                            </p>
                          </div>
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (scheme.official_url) {
                                window.open(scheme.official_url, '_blank');
                              }
                            }}
                            className="bg-white/5 p-2 rounded-lg group-hover:bg-primary transition-all cursor-pointer"
                          >
                            <ChevronRight className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col space-y-3">
                          <div className="flex items-start text-sm text-gray-300">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 mr-2 text-green-500 shrink-0" />
                            <div className="flex flex-wrap items-center">
                              <span className="font-medium mr-2">{t('card_eligibility')}:</span>
                              <span className="text-gray-400">
                                {currentLanguage === 'hi' ? scheme.eligibility_hi : scheme.eligibility}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <Info className="w-4 h-4 mr-2 text-blue-400 shrink-0" />
                            <span className="font-medium mr-2">{t('card_state')}:</span>
                            <span className="text-gray-400">
                              {t(scheme.state)}
                            </span>
                          </div>
                          
                          <div className="pt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const sName = currentLanguage === 'hi' ? scheme.name_hi : scheme.name;
                                const sDesc = currentLanguage === 'hi' ? scheme.description_hi : scheme.description;
                                const chatMsg = currentLanguage === 'hi' 
                                  ? `मुझे "${sName}" योजना के बारे में बताएं। इसका विवरण है: "${sDesc}"। मैं इसके लिए कैसे आवेदन कर सकता हूँ?`
                                  : `Tell me more about the "${sName}" scheme. Its description is: "${sDesc}". How can I apply?`;
                                
                                const event = new CustomEvent('openChatWithMsg', {
                                  detail: { message: chatMsg }
                                });
                                window.dispatchEvent(event);
                              }}
                              className="w-full py-2 px-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold hover:bg-purple-500 hover:text-white transition-all flex items-center justify-center space-x-2"
                            >
                              <Bot className="w-4 h-4" />
                              <span>{t('btn_ask_ai')}</span>
                            </button>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default SchemesPage;
