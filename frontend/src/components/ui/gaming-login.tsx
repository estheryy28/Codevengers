'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface FormInputProps {
    icon: React.ReactNode;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    rightElement?: React.ReactNode;
}

interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
    id: string;
}

// FormInput Component
export const FormInput: React.FC<FormInputProps> = ({ icon, type, placeholder, value, onChange, required, rightElement }) => {
    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                {icon}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-purple-500/50 transition-colors relative z-10"
            />
            {rightElement && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
                    {rightElement}
                </div>
            )}
        </div>
    );
};

// ToggleSwitch Component
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, id }) => {
    return (
        <div className="relative inline-block w-10 h-5 cursor-pointer">
            <input
                type="checkbox"
                id={id}
                className="sr-only"
                checked={checked}
                onChange={onChange}
            />
            <div className={`absolute inset-0 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-red-600' : 'bg-white/20'}`}>
                <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${checked ? 'transform translate-x-5' : ''}`} />
            </div>
        </div>
    );
};

// VideoBackground Component
interface VideoBackgroundProps {
    videoUrl: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoUrl }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error("Video autoplay failed:", error);
            });
        }
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-black/50 z-10" />
            <video
                ref={videoRef}
                className="absolute inset-0 min-w-full min-h-full object-cover w-auto h-auto"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

// GradientBackground (fallback if video doesn't work)
export const GradientBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900" />
            <div className="absolute inset-0">
                {/* Animated orbs */}
                <div className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(139,92,246,0.8) 0%, transparent 70%)',
                        left: '10%',
                        top: '20%',
                    }}
                />
                <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(236,72,153,0.8) 0%, transparent 70%)',
                        right: '15%',
                        bottom: '25%',
                        animationDelay: '1s',
                    }}
                />
            </div>
        </div>
    );
};

// Main LoginForm Component
interface LoginFormProps {
    onSubmit: (username: string, password: string) => void;
    onRegisterClick?: () => void;
    isLoading?: boolean;
    error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onRegisterClick, isLoading, error }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(username, password);
    };

    return (
        <div className="p-8 rounded-2xl backdrop-blur-sm bg-black/50 border border-white/10 w-full max-w-md">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2 relative group">
                    <span className="absolute -inset-1 bg-gradient-to-r from-red-600/30 via-red-500/30 to-red-400/30 blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500 animate-pulse"></span>
                    <span className="relative inline-block text-3xl font-bold mb-2 text-white">
                        Codevengers
                    </span>
                </h2>
                <p className="text-white/80 flex flex-col items-center space-y-1">
                    <span className="relative group cursor-default">
                        <span className="relative inline-block animate-pulse">Login to the Codevengers Multiverse</span>
                    </span>
                    <span className="text-xs text-white/50 animate-pulse">
                        [Debug. Fix. Conquer.]
                    </span>
                    <div className="flex space-x-2 text-xs text-white/40">
                        <span className="animate-pulse">💻</span>
                        <span className="animate-bounce">🐛</span>
                        <span className="animate-pulse">🦸</span>
                    </div>
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    icon={<User className="text-white/60" size={18} />}
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <div className="relative">
                    <FormInput
                        icon={<Lock className="text-white/60" size={18} />}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        rightElement={
                            <button
                                type="button"
                                className="text-white/60 hover:text-white focus:outline-none transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        }
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div onClick={() => setRemember(!remember)} className="cursor-pointer">
                            <ToggleSwitch
                                checked={remember}
                                onChange={() => setRemember(!remember)}
                                id="remember-me"
                            />
                        </div>
                        <label
                            htmlFor="remember-me"
                            className="text-sm text-white/80 cursor-pointer hover:text-white transition-colors"
                            onClick={() => setRemember(!remember)}
                        >
                            Remember me
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-red-500/20 hover:shadow-red-500/40`}
                >
                    {isLoading ? 'Logging in...' : 'Enter Multiverse'}
                </button>
            </form>

            <p className="mt-8 text-center text-sm text-white/60">
                Don't have an account?{' '}
                <button onClick={onRegisterClick} className="font-medium text-white hover:text-purple-300 transition-colors">
                    Create Account
                </button>
            </p>
        </div>
    );
};

// Register Form Component
interface RegisterFormProps {
    onSubmit: (username: string, password: string) => void;
    onLoginClick?: () => void;
    isLoading?: boolean;
    error?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onLoginClick, isLoading, error }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }
        setFormError('');
        onSubmit(username, password);
    };

    return (
        <div className="p-8 rounded-2xl backdrop-blur-sm bg-black/50 border border-white/10 w-full max-w-md">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2 relative group">
                    <span className="absolute -inset-1 bg-gradient-to-r from-red-600/30 via-red-500/30 to-red-400/30 blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500 animate-pulse"></span>
                    <span className="relative inline-block text-3xl font-bold mb-2 text-white">
                        Codevengers
                    </span>
                </h2>
                <p className="text-white/80 flex flex-col items-center space-y-1">
                    <span className="relative group cursor-default">
                        <span className="relative inline-block animate-pulse">Join the Codevengers Multiverse</span>
                    </span>
                    <span className="text-xs text-white/50 animate-pulse">
                        [Debug. Fix. Conquer.]
                    </span>
                    <div className="flex space-x-2 text-xs text-white/40">
                        <span className="animate-pulse">💻</span>
                        <span className="animate-bounce">🐛</span>
                        <span className="animate-pulse">🦸</span>
                    </div>
                </p>
            </div>

            {(error || formError) && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                    {error || formError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    icon={<User className="text-white/60" size={18} />}
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <FormInput
                    icon={<Lock className="text-white/60" size={18} />}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    rightElement={
                        <button
                            type="button"
                            className="text-white/60 hover:text-white focus:outline-none transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    }
                />

                <FormInput
                    icon={<Lock className="text-white/60" size={18} />}
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
                >
                    {isLoading ? 'Creating...' : 'Create Account'}
                </button>
            </form>

            <p className="mt-8 text-center text-sm text-white/60">
                Already have an account?{' '}
                <button onClick={onLoginClick} className="font-medium text-white hover:text-purple-300 transition-colors">
                    Login
                </button>
            </p>
        </div>
    );
};

const GamingLogin = {
    LoginForm,
    RegisterForm,
    VideoBackground,
    GradientBackground,
    FormInput,
    ToggleSwitch,
};

export default GamingLogin;
