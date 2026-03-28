import React from 'react';
import PageLayout from '../components/PageLayout';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyPolicy = () => {
  const { t } = useLanguage();
  return (
    <PageLayout title={t('privacy_title')}>
      <div className="max-w-4xl mx-auto space-y-8 py-10 text-gray-300 px-4">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t('legal_intro_title')}</h2>
          <p className="leading-relaxed">
            {t('legal_intro_desc')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t('legal_collect_title')}</h2>
          <p className="leading-relaxed">
            {t('legal_collect_desc')}
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>{t('legal_collect_item1')}</li>
            <li>{t('legal_collect_item2')}</li>
            <li>{t('legal_collect_item3')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t('legal_use_title')}</h2>
          <p className="leading-relaxed">
            {t('legal_use_desc')}
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>{t('legal_use_item1')}</li>
            <li>{t('legal_use_item2')}</li>
            <li>{t('legal_use_item3')}</li>
            <li>{t('legal_use_item4')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t('legal_sec_title')}</h2>
          <p className="leading-relaxed">
            {t('legal_sec_desc')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t('legal_contact_title')}</h2>
          <p className="leading-relaxed">
            {t('legal_contact_desc')}
          </p>
        </section>

        <div className="pt-8 border-t border-white/10 text-sm text-gray-500">
          {t('legal_last_updated').replace('{date}', 'March 28, 2026')}
        </div>
      </div>
    </PageLayout>
  );
};

export default PrivacyPolicy;
