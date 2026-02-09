import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RegisterForm } from './ui/gaming-login';

export default function Register() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (username: string, password: string) => {
        try {
            setError('');
            setLoading(true);
            await register(username, password);

            // Request fullscreen before navigating
            try {
                await document.documentElement.requestFullscreen();
            } catch (fullscreenError) {
                setError('Fullscreen mode is required. Please allow fullscreen and try again.');
                setLoading(false);
                return;
            }

            navigate('/select-language');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 overflow-hidden">
            {/* Full-screen Video Background - 16:9 Aspect Ratio */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-black">
                <div className="absolute inset-0 flex items-center justify-center">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full"
                        style={{
                            aspectRatio: '16/9',
                            objectFit: 'cover',
                            minWidth: '100%',
                            minHeight: '100%'
                        }}
                    >
                        <source src="/login-bg.mp4#t=3" type="video/mp4" />
                    </video>
                </div>
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="relative z-50 w-full max-w-md animate-fade-in-up">
                <RegisterForm
                    onSubmit={handleRegister}
                    onLoginClick={() => navigate('/login')}
                    error={error}
                    isLoading={loading}
                />
            </div>

            <footer className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-sm z-20">
                © 2026 Codevengers. All rights reserved.
            </footer>
        </div>
    );
}
