import React from 'react';
import PageLayout from '../components/PageLayout';
import { 
  LifeBuoy, 
  MessageCircle, 
  ShieldCheck, 
  Zap, 
  Settings, 
  Mail, 
  Phone 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const HelpCategory = ({ icon: Icon, title, description, link }) => (
  <Link to={link} className="block group">
    <div className="bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 group-hover:bg-primary/5 group-hover:border-primary/30 h-full">
      <div className="bg-primary/10 p-3 rounded-xl w-fit mb-4 group-hover:bg-primary/20">
        <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  </Link>
);

const HelpCenter = () => {
  const { t } = useLanguage();
  const categories = [
    {
      icon: Zap,
      title: t('help_cat_getting_started'),
      description: t('help_cat_getting_started_desc'),
      link: "/faq"
    },
    {
      icon: MessageCircle,
      title: t('help_cat_schemes'),
      description: t('help_cat_schemes_desc'),
      link: "/schemes"
    },
    {
      icon: ShieldCheck,
      title: t('help_cat_security'),
      description: t('help_cat_security_desc'),
      link: "/detector"
    },
    {
      icon: Settings,
      title: t('help_cat_account'),
      description: t('help_cat_account_desc'),
      link: "/dashboard"
    },
    {
      icon: Mail,
      title: t('help_cat_contact'),
      description: t('help_cat_contact_desc'),
      link: "/contact"
    },
    {
      icon: LifeBuoy,
      title: t('help_cat_issues'),
      description: t('help_cat_issues_desc'),
      link: "#"
    }
  ];

  return (
    <PageLayout title={t('help_title')}>
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <HelpCategory key={idx} {...cat} />
          ))}
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-white/5 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('help_still_need_help')}</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('help_support_hours')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/contact" 
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center shadow-lg shadow-primary/25"
            >
              <Mail className="w-5 h-5 mr-3" />
              {t('help_btn_send_message')}
            </Link>
            <div className="flex items-center text-gray-300">
              <Phone className="w-5 h-5 mr-2 text-primary" />
              <span>+91 1800-123-4567</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HelpCenter;
