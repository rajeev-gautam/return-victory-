import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Mail, 
  ChevronRight,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: t('footer_quick_links'),
      links: [
        { name: t('footer_find_schemes'), path: '/schemes' },
        { name: t('footer_detector'), path: '/detector' },
        { name: t('footer_chat'), path: '/chat' },
        { name: t('footer_dashboard'), path: '/dashboard' },
      ]
    },
    {
      title: t('footer_support'),
      links: [
        { name: t('footer_help_center'), path: '/help' },
        { name: t('footer_faq'), path: '/faq' },
        { name: t('footer_contact_us'), path: '/contact' },
      ]
    },
    {
      title: t('footer_legal'),
      links: [
        { name: t('footer_privacy'), path: '/privacy' },
        { name: t('footer_terms'), path: '/terms' },
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'WhatsApp', icon: MessageCircle, href: '#' },
  ];

  return (
    <footer className="relative mt-20 border-t border-white/5 bg-[#050505] overflow-hidden pt-20 pb-10">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="bg-primary/20 p-2.5 rounded-xl border border-primary/30 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white uppercase">{t('brand_name')}</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs cursor-default">
              {t('brand_desc')}
            </p>
            <div className="flex items-center space-x-3 text-gray-500 hover:text-primary transition-colors cursor-pointer group w-fit">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-sm">sgrid.work@gmail.com</span>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-bold mb-8 text-lg">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-gray-400 hover:text-primary transition-all duration-300 text-[15px] flex items-center group"
                    >
                      <ChevronRight className="w-3.5 h-3.5 mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-gray-500 text-sm uppercase tracking-wide">
            {t('footer_copyright').replace('{year}', currentYear)}
          </div>

          {/* Social Icons matching the reference style */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <a 
                key={social.name} 
                href={social.href} 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all duration-300 group"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Aesthetic float element */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
    </footer>
  );
};

export default Footer;
