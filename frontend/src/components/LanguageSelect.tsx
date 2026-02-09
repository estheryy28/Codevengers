import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Code2, Cpu, Coffee, Terminal } from 'lucide-react';
import RainingLetters from './ui/modern-animated-hero-section';

const languageIcons: Record<string, React.ReactNode> = {
    'C': <Terminal className="w-12 h-12" />,
    'C++': <Cpu className="w-12 h-12" />,
    'Java': <Coffee className="w-12 h-12" />,
    'Python': <Code2 className="w-12 h-12" />,
};

export default function LanguageSelect() {
    const [languages, setLanguages] = useState<string[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const res = await axios.get('/challenges/languages');
                setLanguages(res.data.data.languages);
            } catch (err: any) {
                console.error('Fetch languages error:', err);
                // Redirect to login if not authenticated
                if (err.response?.status === 401 || err.response?.status === 403) {
                    navigate('/login');
                    return;
                }
                setError(err.response?.data?.message || 'Failed to fetch languages');
            } finally {
                setLoading(false);
            }
        };
        fetchLanguages();
    }, [navigate]);

    const handleSelect = async () => {
        if (!selectedLanguage) return;

        try {
            setSubmitting(true);
            await axios.post('/challenges/select-language', { language: selectedLanguage });

            // Request fullscreen mode before navigating to quiz
            try {
                await document.documentElement.requestFullscreen();
                navigate('/quiz');
            } catch (fullscreenError) {
                // If fullscreen fails, show error and don't proceed
                setError('Fullscreen mode is required to start the exam. Please allow fullscreen and try again.');
                setSubmitting(false);
                return;
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to select language');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <RainingLetters>
            <div className="min-h-screen w-full flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-2xl animate-fade-in-up">
                    <div className="card">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2 glow-text">
                                Choose Your Language
                            </h1>
                            <p className="text-white/60">
                                Select a programming language to start debugging challenges
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setSelectedLanguage(lang)}
                                    className={`p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-4 ${selectedLanguage === lang
                                        ? 'bg-red-600/20 border-red-500 shadow-lg shadow-red-500/20'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className={`${selectedLanguage === lang ? 'text-red-400' : 'text-white/70'}`}>
                                        {languageIcons[lang] || <Code2 className="w-12 h-12" />}
                                    </div>
                                    <span className={`text-lg font-medium ${selectedLanguage === lang ? 'text-red-300' : 'text-white'
                                        }`}>
                                        {lang}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleSelect}
                            disabled={!selectedLanguage || submitting}
                            className="btn-primary w-full"
                        >
                            {submitting ? 'Starting Challenges...' : 'Start Debugging'}
                        </button>

                        <p className="mt-4 text-center text-sm text-white/50">
                            ⚠️ You cannot change your language after starting
                        </p>
                    </div>
                </div>
            </div>
        </RainingLetters>
    );
}
