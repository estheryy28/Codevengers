import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from './ui/gaming-login';

export default function Login() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get exam termination message from navigation state
    const examMessage = (location.state as { message?: string })?.message;

    const handleLogin = async (username: string, password: string) => {
        try {
            setError('');
            setLoading(true);
            await login(username, password);

            // Request fullscreen before navigating
            try {
                await document.documentElement.requestFullscreen();
            } catch (fullscreenError) {
                setError('Fullscreen mode is required. Please allow fullscreen and try again.');
                setLoading(false);
                return;
            }

            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
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
                {/* Exam termination warning */}
                {examMessage && (
                    <div className="mb-4 p-4 bg-red-600/90 border border-red-500 rounded-lg text-white text-center shadow-lg">
                        <div className="font-bold mb-1">⚠️ Exam Violation</div>
                        <div className="text-sm">{examMessage}</div>
                    </div>
                )}
                <LoginForm
                    onSubmit={handleLogin}
                    onRegisterClick={() => navigate('/register')}
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
