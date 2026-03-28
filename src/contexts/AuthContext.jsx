import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('--- AuthProvider: starting checkAuth ---');
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('--- AuthProvider: token found:', !!token);
                if (token) {
                    const res = await api.get('/auth/me');
                    console.log('--- AuthProvider: auth/me response:', res.status);
                    setUser(res.data);
                }
            } catch (err) {
                console.error('--- AuthProvider: Auth check failed:', err);
                localStorage.removeItem('token');
            } finally {
                console.log('--- AuthProvider: setting loading to false ---');
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (username, password) => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        const res = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        localStorage.setItem('token', res.data.access_token);
        const userRes = await api.get('/auth/me');
        setUser(userRes.data);
    };

    const register = async (email, password, age, gender, occupation, salary, isMarried) => {
        await api.post('/auth/register', {
            email,
            password,
            age: parseInt(age),
            gender,
            occupation,
            salary: parseFloat(salary),
            is_married: isMarried === 'yes' || isMarried === true
        });
        await login(email, password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    console.log('--- AuthProvider: rendering, loading:', loading, 'user:', !!user);
    if (loading) return <div style={{ color: 'black', background: 'white', padding: '20px' }}>Loading Auth State...</div>;

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
