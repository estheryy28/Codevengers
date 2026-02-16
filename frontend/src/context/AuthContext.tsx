import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
    _id: string;
    username: string;
    role: 'ADMIN' | 'USER';
    selectedProgrammingLanguage: string | null;
    totalScore: number;
    quizStarted: boolean;
    completedQuestions: string[];
    violations: number;
    isDisqualified: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure axios defaults
axios.defaults.baseURL = '/api';

// Set token from localStorage immediately (synchronously) if it exists
const storedToken = localStorage.getItem('token');
if (storedToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Set axios auth header when token changes
    useEffect(() => {
        console.log('AuthContext: Token changed', token ? 'Token exists' : 'No token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
            console.log('AuthContext: Set Authorization header');
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
            console.log('AuthContext: Removed Authorization header');
        }
    }, [token]);

    // Fetch user on mount if token exists
    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await axios.get('/auth/me');
                    setUser(res.data.data.user);
                } catch (error) {
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [token]);

    const login = async (username: string, password: string) => {
        const res = await axios.post('/auth/login', { username, password });
        setToken(res.data.data.token);
        setUser(res.data.data.user);
    };

    const register = async (username: string, password: string) => {
        const res = await axios.post('/auth/register', { username, password });
        setToken(res.data.data.token);
        setUser(res.data.data.user);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const res = await axios.get('/auth/me');
            setUser(res.data.data.user);
        } catch (error) {
            console.error('Failed to refresh user');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
