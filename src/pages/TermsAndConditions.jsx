import React from 'react';
import PageLayout from '../components/PageLayout';
import { useLanguage } from '../contexts/LanguageContext';

const TermsAndConditions = () => {
  const { t } = useLanguage();
  return (
    <PageLayout title={t('terms_title')}>
      <div className="max-w-4xl mx-auto space-y-8 py-10 text-gray-300 px-4">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t('terms_sec1_title')}</h2>
          <p className="leading-relaxed">
            {t('terms_sec1_desc')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t('terms_sec2_title')}</h2>
          <p className="leading-relaxed">
            {t('terms_sec2_desc')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t('terms_sec3_title')}</h2>
          <p className="leading-relaxed">
            {t('terms_sec3_desc')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t('terms_sec4_title')}</h2>
          <p className="leading-relaxed">
            {t('terms_sec4_desc')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t('terms_sec5_title')}</h2>
          <p className="leading-relaxed">
            {t('terms_sec5_desc')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t('terms_sec6_title')}</h2>
          <p className="leading-relaxed">
            {t('terms_sec6_desc')}
          </p>
        </section>

        <div className="pt-8 border-t border-white/10 text-sm text-gray-500">
          {t('legal_last_updated').replace('{date}', 'March 28, 2026')}
        </div>
      </div>
    </PageLayout>
  );
};

export default TermsAndConditions;
