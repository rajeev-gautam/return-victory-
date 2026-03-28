import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertTriangle, ExternalLink, RefreshCcw, Info, CheckCircle2 } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { runPortalAnalysis } from '../utils/portalDetector';
import { useLanguage } from '../contexts/LanguageContext';

const DetectorPage = () => {
  const { t } = useLanguage();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeUrl = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { score, status, reasons, contentFetched } = await runPortalAnalysis(url);

      setResult({ score, status, reasons, contentFetched });

      const lastChecks = JSON.parse(localStorage.getItem('lastChecks') || '[]');
      localStorage.setItem('lastChecks', JSON.stringify([
        { url, status, score, date: new Date().toISOString() },
        ...lastChecks.slice(0, 4)
      ]));
    } catch {
      setResult({
        score: 40,
        status: 'suspicious',
        reasons: ['Analysis failed (network or invalid URL). Try again.'],
        contentFetched: false,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resultMessage = (status) => {
    if (status === 'safe') return t('det_risk_msg_safe');
    if (status === 'suspicious') return t('det_risk_msg_suspicious');
    return t('det_risk_msg_dangerous');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return 'text-green-500';
      case 'suspicious': return 'text-yellow-500';
      case 'dangerous': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'safe': return 'bg-green-500/10 border-green-500/20';
      case 'suspicious': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'dangerous': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{t('det_title_1')} <span className="text-gradient">{t('det_title_2')}</span></h1>
          <p className="text-gray-400">{t('det_subtitle')}</p>
        </div>

        <GlassCard className="p-8">
          <form onSubmit={analyzeUrl} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t('det_placeholder')}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:ring-1 focus:ring-primary focus:outline-none text-lg"
              />
            </div>
            <Button type="submit" disabled={isAnalyzing || !url} className="h-14 md:w-32">
              {isAnalyzing ? <RefreshCcw className="w-6 h-6 animate-spin" /> : t('det_btn_verify')}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1 text-green-500" /> {t('det_legend_official')}</span>
            <span className="flex items-center"><ShieldAlert className="w-4 h-4 mr-1 text-red-500" /> {t('det_legend_suspicious')}</span>
          </div>
        </GlassCard>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <GlassCard className={`p-8 ${getStatusBg(result.status)} border`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {result.status === 'safe' && <ShieldCheck className="w-10 h-10 text-green-500" />}
                      {result.status === 'suspicious' && <AlertTriangle className="w-10 h-10 text-yellow-500" />}
                      {result.status === 'dangerous' && <ShieldAlert className="w-10 h-10 text-red-500" />}
                      <h2 className={`text-3xl font-bold uppercase tracking-tight ${getStatusColor(result.status)}`}>
                        {t(`risk_${result.status}`)}
                      </h2>
                    </div>
                    <p className="text-gray-300 text-lg">{resultMessage(result.status)}</p>
                    {Array.isArray(result.reasons) && result.reasons.length > 0 && (
                      <ul className="text-sm text-gray-400 space-y-2 list-disc pl-5 pt-2">
                        {result.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    )}
                    {result.contentFetched === false && (
                      <p className="text-xs text-gray-500 pt-2">Tip: Page fetch uses a browser-safe proxy; some sites block automated reads.</p>
                    )}
                    <div className="flex space-x-4 pt-2">
                      <Button variant="secondary" className="px-4 py-2 text-sm" onClick={() => window.open(url, '_blank')}>
                        {t('det_btn_visit')} <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-400 mb-2 font-medium uppercase tracking-widest">{t('det_risk_score')}</span>
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="96"
                          cy="96"
                          r="80"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="transparent"
                          className="text-white/5"
                        />
                        <motion.circle
                          initial={{ strokeDashoffset: 502 }}
                          animate={{ strokeDashoffset: 502 - (502 * result.score) / 100 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          cx="96"
                          cy="96"
                          r="80"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="transparent"
                          strokeDasharray="502"
                          className={getStatusColor(result.status)}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-5xl font-extrabold ${getStatusColor(result.status)}`}>{result.score}</span>
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-tighter">{t('det_out_of_100')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="space-y-4">
            <h3 className="text-lg font-bold flex items-center"><Info className="w-5 h-5 mr-2 text-primary" /> {t('det_check_title')}</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5" /> {t('det_check_item1')}</li>
              <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5" /> {t('det_check_item2')}</li>
              <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5" /> {t('det_check_item3')}</li>
              <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5" /> {t('det_check_item4')}</li>
            </ul>
          </GlassCard>
          <GlassCard className="space-y-4">
            <h3 className="text-lg font-bold flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-green-500" /> {t('det_safe_title')}</h3>
            <p className="text-gray-400 text-sm">{t('det_safe_desc')}</p>
          </GlassCard>
        </div>
      </div>
    </PageLayout>
  );
};

export default DetectorPage;
