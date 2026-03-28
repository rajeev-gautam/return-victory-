import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../contexts/AuthContext';
import { Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LoginPage = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(t('login_error'));
        }
    };

    return (
        <PageLayout>
            <div className="flex items-center justify-center min-h-[70vh]">
                <GlassCard className="w-full max-w-md p-8 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-primary/20 p-3 rounded-full border border-primary/30 mb-4 animate-pulse">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold">{t('login_welcome')}</h2>
                        <p className="text-gray-400">{t('login_signin_desc')}</p>
                    </div>

                    {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md mb-6 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('login_email')}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('login_password')}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-md font-medium transition-colors"
                        >
                            {t('login_btn_signin')}
                        </button>
                    </form>
                    <div className="mt-6 text-center text-sm text-gray-400">
                        {t('login_no_account')} <Link to="/register" className="text-primary hover:underline">{t('login_signup_link')}</Link>
                    </div>
                </GlassCard>
            </div>
        </PageLayout>
    );
};

export default LoginPage;
