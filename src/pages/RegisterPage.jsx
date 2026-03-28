import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../contexts/AuthContext';
import { Shield, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const RegisterPage = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [occupation, setOccupation] = useState('');
    const [salary, setSalary] = useState('');
    const [isMarried, setIsMarried] = useState('no');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const rules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        digit: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const isPasswordValid = Object.values(rules).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isPasswordValid) {
            return setError(t('reg_err_reqs'));
        }
        if (password !== confirmPassword) {
            return setError(t('reg_err_match'));
        }
        if (!age || !occupation || !salary) {
            return setError(t('reg_err_fill_all'));
        }

        setLoading(true);
        try {
            await register(email, password, age, gender, occupation, salary, isMarried);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to register account. Server might be down.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout>
            <div className="flex items-center justify-center min-h-[70vh] py-12">
                <GlassCard className="w-full max-w-2xl p-8 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-primary/20 p-3 rounded-full border border-primary/30 mb-4 animate-pulse">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold">{t('reg_title')}</h2>
                        <p className="text-gray-400">{t('reg_subtitle')}</p>
                    </div>

                    {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md mb-6 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('label_age')}</label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-white"
                                        placeholder={t('placeholder_age')}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('label_gender')}</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-white [&>option]:bg-black"
                                    >
                                        <option value="Male">{t('gender_male')}</option>
                                        <option value="Female">{t('gender_female')}</option>
                                        <option value="Other">{t('gender_other')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('label_occupation')}</label>
                                <div className="relative">
                                    <select
                                        value={occupation}
                                        onChange={(e) => setOccupation(e.target.value)}
                                        className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-white appearance-none cursor-pointer [&>option]:bg-black"
                                        required
                                    >
                                        <option value="">{t('select_occupation')}</option>
                                        <option value="student">{t('occ_student')}</option>
                                        <option value="farmer">{t('occ_farmer')}</option>
                                        <option value="service">{t('occ_service')}</option>
                                        <option value="business">{t('occ_business')}</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('label_income')}</label>
                                <input
                                    type="number"
                                    value={salary}
                                    onChange={(e) => setSalary(e.target.value)}
                                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-white"
                                    placeholder={t('placeholder_income')}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('reg_married')}</label>
                                <select
                                    value={isMarried}
                                    onChange={(e) => setIsMarried(e.target.value)}
                                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-white [&>option]:bg-black"
                                >
                                    <option value="no">{t('reg_no')}</option>
                                    <option value="yes">{t('reg_yes')}</option>
                                </select>
                            </div>
                        </div>

                        <hr className="border-white/10 my-4" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('login_password')}</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-white"
                                    required
                                />

                                {password.length > 0 && !isPasswordValid && (
                                    <div className="mt-2 space-y-1 text-xs">
                                        {!rules.length && <p className="text-gray-400">• {t('reg_password_len')}</p>}
                                        {!rules.uppercase && <p className="text-gray-400">• {t('reg_password_upper')}</p>}
                                        {!rules.lowercase && <p className="text-gray-400">• {t('reg_password_lower')}</p>}
                                        {!rules.digit && <p className="text-gray-400">• {t('reg_password_digit')}</p>}
                                        {!rules.special && <p className="text-gray-400">• {t('reg_password_special')}</p>}
                                    </div>
                                )}
                                {password.length > 0 && isPasswordValid && (
                                    <p className="mt-2 text-xs text-green-400 font-medium">{t('reg_password_valid')}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('reg_confirm_password')}</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-white"
                                    required
                                />
                            </div>
                        </div>

                         <button
                            type="submit"
                            disabled={loading || !isPasswordValid}
                            className={`w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-md font-medium transition-colors ${(loading || !isPasswordValid) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? t('reg_processing') : t('reg_btn_signup')}
                        </button>
                    </form>
                    <div className="mt-6 text-center text-sm text-gray-400">
                        {t('reg_already_account')} <Link to="/login" className="text-primary hover:underline">{t('reg_login_link')}</Link>
                    </div>
                </GlassCard>
            </div>
        </PageLayout>
    );
};

export default RegisterPage;
