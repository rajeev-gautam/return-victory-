import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Shield, ShieldAlert, CheckCircle, Activity, Search, Clock, Award, ChevronRight, Sparkles, Bot } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { getRecommendedSchemes } from '../services/groq';

import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';

const DashboardPage = () => {
  const { user } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [recommendedSchemes, setRecommendedSchemes] = useState([]);
  const [loadingSchemes, setLoadingSchemes] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setDashboardData(res.data);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!user || fetchedRef.current) return;
    const fetchSchemes = async () => {
      try {
        fetchedRef.current = true;
        setLoadingSchemes(true);
        const schemes = await getRecommendedSchemes(user, currentLanguage);
        setRecommendedSchemes(schemes);
      } catch (err) {
        console.error("Failed to fetch AI schemes:", err);
      } finally {
        setLoadingSchemes(false);
      }
    };
    fetchSchemes();
  }, [user, currentLanguage]);

  if (loading) return (
    <PageLayout>
      <div className="flex justify-center flex-col items-center h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-400">{t('loading')}</p>
      </div>
    </PageLayout>
  );

  if (error) return (
    <PageLayout>
      <div className="text-red-500 text-center mt-10 p-4 bg-red-500/10 rounded-lg border border-red-500/20">{error}</div>
    </PageLayout>
  );

  const { stats, riskData, activityData, recentChecks } = dashboardData;

  const renderIcon = (iconName, props) => {
    const icons = {
      Search: <Search {...props} />,
      CheckCircle: <CheckCircle {...props} />,
      ShieldAlert: <ShieldAlert {...props} />,
      Activity: <Activity {...props} />
    };
    return icons[iconName] || <Shield {...props} />;
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold uppercase">{t('db_welcome')}, <span className="text-gradient">{user?.email.split('@')[0] || 'User'}</span></h1>
          <p className="text-gray-400">{t('db_sub')}</p>
        </div>

        {/* Recommended Schemes Highlight */}
        <div className="mb-8 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-20"></div>
          <GlassCard className="relative border-primary/30">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold uppercase">{t('db_rec_title')}</h2>
            </div>

            {loadingSchemes ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-gray-400 animate-pulse text-sm italic">{t('db_loading_schemes')}</p>
              </div>
            ) : recommendedSchemes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedSchemes.map((scheme, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx}
                    className="bg-black/40 border border-white/10 hover:border-primary/50 transition-all duration-300 p-6 rounded-2xl group cursor-pointer flex flex-col h-full relative overflow-hidden ring-1 ring-white/5"
                  >
                    {/* AI Badge */}
                    <div className="absolute top-0 right-0 px-3 py-1 bg-primary/20 border-b border-l border-primary/30 rounded-bl-xl flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                      <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">AI Choice</span>
                    </div>

                    <h3 className="font-bold text-lg text-white mb-3 group-hover:text-primary transition-colors leading-tight">
                      {scheme.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 flex-grow leading-relaxed">
                      {scheme.description}
                    </p>

                    <div className="space-y-3">
                      <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl relative group-hover:bg-primary/15 transition-colors">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                          <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest">
                            {t('db_scheme_reason_label')}
                          </span>
                        </div>
                        <p className="text-xs text-blue-100 italic leading-relaxed">
                          {scheme.reason || "Analyzing your profile to find more matches..."}
                        </p>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const chatMsg = currentLanguage === 'hi' 
                            ? `मुझे "${scheme.name}" योजना के बारे में बताएं। इसका विवरण है: "${scheme.description}"। मैं इसके लिए कैसे आवेदन कर सकता हूँ?`
                            : `Tell me more about the "${scheme.name}" scheme. Its description is: "${scheme.description}". How can I apply?`;
                            
                          const event = new CustomEvent('openChatWithMsg', {
                            detail: { message: chatMsg }
                          });
                          window.dispatchEvent(event);
                        }}
                        className="w-full flex items-center justify-center space-x-2 py-2 pr-4 pl-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold rounded-xl hover:bg-purple-500 hover:text-white transition-all mb-2"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>{t('btn_ask_ai')}</span>
                      </button>

                      <button 
                        onClick={() => window.open(scheme.official_url, '_blank')}
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-white/5 hover:bg-white/10 text-sm text-white font-medium rounded-xl transition-all border border-white/5 group-hover:border-primary/30 group-hover:text-primary"
                      >
                        <span>{t('db_learn_more')}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">{t('db_no_schemes')}</p>
            )}
          </GlassCard>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const labelMap = {
              "Total Schemes": "stat_schemes",
              "Safe Links Scanned": "stat_links_scanned",
              "Threats Detected": "stat_threats_detected",
              "System Health": "stat_system_health"
            };
            const translationKey = stat.key || labelMap[stat.label];
            
            return (
              <GlassCard key={idx} className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  {renderIcon(stat.icon, { className: `w-6 h-6 ${stat.color}` })}
                </div>
                <div>
                  <p className="text-sm text-gray-400">{translationKey ? t(translationKey) : stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard className="h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold uppercase">{t('db_weekly')}</h3>
              {activityData.every(d => d.checks === 0) && (
                <span className="text-xs text-blue-300 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500/20">{t('db_no_activity')}</span>
              )}
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData.map(d => ({ ...d, day: t(`day_${d.day.toLowerCase()}`) }))}>
                  <defs>
                    <linearGradient id="colorChecks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    labelFormatter={(label) => label}
                    formatter={(value) => [value, t('stat_checks')]}
                  />
                  <Area type="monotone" dataKey="checks" stroke="#3b82f6" fillOpacity={1} fill="url(#colorChecks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="h-[400px] flex flex-col">
            <h3 className="text-lg font-bold mb-6 uppercase">{t('db_threat_dist')}</h3>
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 min-h-0 relative">
                {riskData.every(d => d.value === 0) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none pb-6">
                    <Shield className="w-8 h-8 opacity-20 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-400">{t('db_no_threats')}</span>
                  </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData.every(d => d.value === 0) ? [{ name: 'Empty', value: 1, color: '#1e293b' }] : riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {(riskData.every(d => d.value === 0) ? [{ name: 'Empty', value: 1, color: '#1e293b' }] : riskData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    {!riskData.every(d => d.value === 0) && (
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    )}
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center flex-wrap gap-4 mt-2 pt-4 border-t border-white/5">
                {riskData.map((item, idx) => (
                  <div key={idx} className="flex items-center text-xs">
                    <div className={`w-3 h-3 rounded-full mr-2 ${item.value === 0 && riskData.every(d => d.value === 0) ? 'opacity-30' : ''}`} style={{ backgroundColor: item.color }} />
                    <span className={`${item.value === 0 && riskData.every(d => d.value === 0) ? 'text-gray-600' : 'text-gray-400'}`}>
                      {t(`risk_${item.name.toLowerCase()}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* User Queries / Grievances Tracking */}
        <div className="mt-8">
          <GlassCard>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold uppercase">{t('db_requests_title')}</h2>
            </div>
            
            <RequestList t={t} />
          </GlassCard>
        </div>
      </div>
    </PageLayout>
  );
};

const RequestList = ({ t }) => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/queries', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setQueries(res.data);
      } catch (err) {
        console.error("Failed to fetch queries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQueries();
    
    // Listen for new query submissions
    const handleRefresh = () => fetchQueries();
    window.addEventListener('refreshQueries', handleRefresh);
    return () => window.removeEventListener('refreshQueries', handleRefresh);
  }, []);

  if (loading) return <div className="text-center py-6 animate-pulse text-gray-500">Fetching requests...</div>;
  if (!queries.length) return <div className="text-center py-6 text-gray-500 italic">No grievances or requests filed yet.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-white/5">
          <tr>
            <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('db_col_date')}</th>
            <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('db_col_subject')}</th>
            <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('db_col_status')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {queries.map((q) => (
            <tr key={q.id} className="hover:bg-white/5 transition-colors group">
              <td className="py-4 px-4 text-sm text-gray-400">
                {new Date(q.date).toLocaleDateString()}
              </td>
              <td className="py-4 px-4">
                <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">{q.subject}</p>
                <p className="text-xs text-gray-500 truncate max-w-[200px]">{q.message}</p>
              </td>
              <td className="py-4 px-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  q.status === 'pending' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                  q.status === 'acknowledged' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  'bg-green-500/10 text-green-400 border border-green-500/20'
                }`}>
                  {t(`status_${q.status}`)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardPage;
