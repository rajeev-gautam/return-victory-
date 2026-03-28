import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, CheckCircle, Search, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { useLanguage } from '../contexts/LanguageContext';

const LandingPage = () => {
  const { t } = useLanguage();

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-8 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4"
        >
          <Zap className="w-4 h-4" />
          <span>{t('hero_badge')}</span>
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase">
          {t('hero_title_part1')} <span className="text-gradient">{t('hero_title_part2')}</span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed italic uppercase tracking-widest">
          {t('hero_tagline')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link to="/schemes">
            <Button className="w-full sm:w-auto h-14 text-lg">
              {t('btn_check_schemes')} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/detector">
            <Button variant="secondary" className="w-full sm:w-auto h-14 text-lg">
              {t('btn_verify_link')} <Shield className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Floating Features Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full text-left">
          <GlassCard className="flex flex-col space-y-4">
            <div className="bg-primary/20 w-12 h-12 rounded-xl flex items-center justify-center border border-primary/30">
              <Search className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">{t('feat_search_title')}</h3>
            <p className="text-gray-400">{t('feat_search_desc')}</p>
          </GlassCard>

          <GlassCard className="flex flex-col space-y-4">
            <div className="bg-green-500/20 w-12 h-12 rounded-xl flex items-center justify-center border border-green-500/30">
              <Shield className="text-green-500 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">{t('feat_detector_title')}</h3>
            <p className="text-gray-400">{t('feat_detector_desc')}</p>
          </GlassCard>

          <GlassCard className="flex flex-col space-y-4">
            <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center border border-purple-500/30">
              <CheckCircle className="text-purple-500 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">{t('feat_apply_title')}</h3>
            <p className="text-gray-400">{t('feat_apply_desc')}</p>
          </GlassCard>
        </div>
      </div>
    </PageLayout>
  );
};

export default LandingPage;
