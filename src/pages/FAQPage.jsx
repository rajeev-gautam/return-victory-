import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left focus:outline-none group"
      >
        <span className={`text-lg transition-colors ${isOpen ? 'text-primary' : 'text-white group-hover:text-primary'}`}>
          {question}
        </span>
        {isOpen ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-gray-500" />}
      </button>
      {isOpen && (
        <div className="mt-4 text-gray-400 leading-relaxed animate-fadeIn">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQPage = () => {
  const { t } = useLanguage();
  const faqs = [
    {
      question: t('faq_q1'),
      answer: t('faq_a1')
    },
    {
      question: t('faq_q2'),
      answer: t('faq_a2')
    },
    {
      question: t('faq_q3'),
      answer: t('faq_a3')
    },
    {
      question: t('faq_q4'),
      answer: t('faq_a4')
    },
    {
      question: t('faq_q5'),
      answer: t('faq_a5')
    }
  ];

  return (
    <PageLayout title={t('faq_title')}>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="space-y-2 mb-10 text-center">
          <p className="text-gray-400">{t('faq_subtitle')}</p>
        </div>
        <div className="bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-10">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default FAQPage;
