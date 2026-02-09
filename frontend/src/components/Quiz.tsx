import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle, Play, Lightbulb, ChevronLeft, ChevronRight, AlertTriangle, Clock, Trophy } from 'lucide-react';
import RainingLetters from './ui/modern-animated-hero-section';
import CodeEditor from './CodeEditor';

interface TestResult {
    testCaseIndex: number;
    passed: boolean;
    input: string;
    actualOutput: string;
    expectedOutput: string;
    executionTime: number;
    error: string | null;
    isHidden: boolean;
}

interface Challenge {
    _id: string;
    title: string;
    description: string;
    programmingLanguage: string;
    difficulty: string;
    buggyCode: string;
    hints: string[];
    testCaseCount: number;
    points: number;
    completed?: boolean;
}

interface SubmitResult {
    status: 'compilation_error' | 'runtime_error' | 'wrong_answer' | 'accepted' | 'partial';
    compilationResult: {
        success: boolean;
        errors: string[];
    };
    testResults: TestResult[];
    passedTests: number;
    totalTests: number;
    score: number;
}

export default function Quiz() {
    const { user, refreshUser, logout } = useAuth();
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [code, setCode] = useState('');
    const [originalCode, setOriginalCode] = useState(''); // Store original for reset
    const [result, setResult] = useState<SubmitResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [hintIndex, setHintIndex] = useState(-1);
    const [currentHint, setCurrentHint] = useState<string | null>(null);
    const [totalScore, setTotalScore] = useState(0);
    const [countdown, setCountdown] = useState<number | null>(null);

    // Exam security: Enter fullscreen on mount, monitor for fullscreen exit, tab switch, or window blur
    useEffect(() => {
        let isExamActive = true;

        // Request fullscreen if not already in fullscreen
        const enterFullscreen = async () => {
            if (!document.fullscreenElement) {
                try {
                    await document.documentElement.requestFullscreen();
                } catch (error) {
                    // If fullscreen fails, log out the user
                    logout();
                    navigate('/login', { state: { message: 'Fullscreen mode is required for the exam. Please allow fullscreen.' } });
                    return;
                }
            }
        };

        enterFullscreen();

        const handleVisibilityChange = () => {
            if (document.hidden && isExamActive) {
                // User switched tabs
                isExamActive = false;
                logout();
                navigate('/login', { state: { message: 'Exam terminated: You switched to another tab.' } });
            }
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && isExamActive) {
                // User exited fullscreen
                isExamActive = false;
                logout();
                navigate('/login', { state: { message: 'Exam terminated: You exited fullscreen mode.' } });
            }
        };

        const handleWindowBlur = () => {
            if (isExamActive) {
                // User switched to another application
                isExamActive = false;
                logout();
                navigate('/login', { state: { message: 'Exam terminated: You switched to another application.' } });
            }
        };

        // Add event listeners
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        window.addEventListener('blur', handleWindowBlur);

        // Cleanup on unmount
        return () => {
            isExamActive = false;
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, [logout, navigate]);

    // Fetch challenges list
    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const res = await axios.get('/challenges');
                const loadedChallenges = res.data.data.challenges;
                setChallenges(loadedChallenges);
                setTotalScore(user?.totalScore || 0);

                // Find the first uncompleted challenge to resume from
                // Only do this on initial load (when challenges is empty)
                if (challenges.length === 0) {
                    const firstUncompletedIndex = loadedChallenges.findIndex((c: Challenge) => !c.completed);
                    if (firstUncompletedIndex !== -1) {
                        setCurrentIndex(firstUncompletedIndex);
                    } else if (loadedChallenges.length > 0) {
                        // All completed, stay on the last one
                        setCurrentIndex(loadedChallenges.length - 1);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch challenges');
            } finally {
                setLoading(false);
            }
        };
        fetchChallenges();
    }, [user]);

    // Fetch current challenge details - only when index changes
    const [lastFetchedIndex, setLastFetchedIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchChallengeDetails = async () => {
            if (challenges.length === 0) return;
            const challengeId = challenges[currentIndex]?._id;
            if (!challengeId) return;

            // Don't refetch if we're on the same challenge (prevents clearing result on challenge update)
            if (lastFetchedIndex === currentIndex) return;

            try {
                const res = await axios.get(`/challenges/${challengeId}`);
                const buggyCode = res.data.data.challenge.buggyCode;
                setCode(buggyCode);
                setOriginalCode(buggyCode); // Store original for reset
                setResult(null);
                setHintIndex(-1);
                setCurrentHint(null);
                setCountdown(null);
                setLastFetchedIndex(currentIndex);
            } catch (err) {
                console.error('Failed to fetch challenge details');
            }
        };
        fetchChallengeDetails();
    }, [currentIndex, challenges.length, lastFetchedIndex]);

    // Auto-advance after successful submission
    useEffect(() => {
        if (result?.status === 'accepted' && currentIndex < challenges.length - 1) {
            setCountdown(5);
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev === null || prev <= 1) {
                        clearInterval(timer);
                        setCurrentIndex(idx => idx + 1);
                        return null;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [result?.status, currentIndex, challenges.length]);

    const currentChallenge = challenges[currentIndex];
    const completedCount = challenges.filter(c => c.completed).length;

    const handleSubmit = async () => {
        if (!code.trim() || !currentChallenge) return;

        setSubmitting(true);
        setResult(null);
        try {
            const res = await axios.post(`/challenges/${currentChallenge._id}/submit`, { code });
            setResult(res.data.data);

            if (res.data.data.status === 'accepted') {
                setTotalScore(prev => prev + res.data.data.score);
                // Mark challenge as completed
                setChallenges(prev => prev.map(c =>
                    c._id === currentChallenge._id ? { ...c, completed: true } : c
                ));
                refreshUser();
            }
        } catch (err: any) {
            console.error('Failed to submit code', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleGetHint = async () => {
        if (!currentChallenge) return;
        const nextHintIndex = hintIndex + 1;

        try {
            const res = await axios.get(`/challenges/${currentChallenge._id}/hint?index=${nextHintIndex}`);
            setCurrentHint(res.data.data.hint);
            setHintIndex(nextHintIndex);
        } catch (err: any) {
            console.error('No more hints');
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'badge-success';
            case 'medium': return 'badge-warning';
            case 'hard': return 'badge-danger';
            default: return 'badge-info';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted': return 'bg-green-500/20 border-green-500/50 text-green-300';
            case 'partial': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
            case 'compilation_error': return 'bg-red-500/20 border-red-500/50 text-red-300';
            default: return 'bg-red-500/20 border-red-500/50 text-red-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'accepted': return <CheckCircle2 className="w-5 h-5" />;
            case 'partial': return <AlertTriangle className="w-5 h-5" />;
            default: return <XCircle className="w-5 h-5" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="spinner"></div>
            </div>
        );
    }

    if (challenges.length === 0) {
        return (
            <RainingLetters>
                <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
                    <div className="card text-center max-w-md animate-fade-in-up">
                        <div className="mb-4 flex justify-center">
                            <AlertTriangle className="w-12 h-12 text-yellow-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">No Challenges Found</h2>
                        <p className="text-white/60 mb-6">
                            No code challenges found for <span className="text-white font-bold">{user?.selectedProgrammingLanguage || 'your language'}</span>.
                            <br />
                            Try selecting a different language (like Java).
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/select-language')}
                                className="btn btn-primary w-full"
                            >
                                Change Language
                            </button>
                            <button
                                onClick={logout}
                                className="btn w-full bg-white/10 hover:bg-white/20 text-white"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </RainingLetters>
        );
    }

    // Check if all challenges are completed
    const allCompleted = challenges.length > 0 && challenges.every(c => c.completed);

    if (allCompleted) {
        return (
            <RainingLetters>
                <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
                    <div className="card text-center max-w-lg animate-fade-in-up">
                        <div className="text-7xl mb-6">🎉</div>
                        <h2 className="text-3xl font-bold text-white mb-2 glow-text">
                            Congratulations, Hero!
                        </h2>
                        <p className="text-xl text-white/80 mb-2">
                            You've conquered all the challenges!
                        </p>
                        <p className="text-white/60 mb-8">
                            Welcome to the Codevengers Hall of Fame
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 rounded-xl bg-red-600/20 border border-red-500/30">
                                <div className="text-3xl font-bold text-red-400">{totalScore}</div>
                                <div className="text-sm text-white/60">Final Score</div>
                            </div>
                            <div className="p-4 rounded-xl bg-green-600/20 border border-green-500/30">
                                <div className="text-3xl font-bold text-green-400">{challenges.length}/{challenges.length}</div>
                                <div className="text-sm text-white/60">Challenges Solved</div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                logout();
                                window.location.href = '/login';
                            }}
                            className="btn-primary w-full"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </RainingLetters>
        );
    }

    return (
        <RainingLetters>
            <div className="min-h-screen pt-20 pb-10 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 animate-fade-in-up">
                        <div>
                            <h1 className="text-3xl font-bold text-white glow-text">
                                Code Debug Challenge
                            </h1>
                            <p className="text-white/60">
                                {user?.selectedProgrammingLanguage} • {completedCount}/{challenges.length} completed
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-3xl font-bold text-red-400">{totalScore}</div>
                                <div className="text-sm text-white/60">Score</div>
                            </div>
                            <button
                                onClick={async () => {
                                    if (window.confirm('Are you sure you want to finish the quiz? This will submit your final score.')) {
                                        try {
                                            await axios.post('/challenges/finish');
                                            await refreshUser();
                                            navigate('/leaderboard');
                                        } catch (err) {
                                            console.error('Failed to finish quiz', err);
                                            navigate('/leaderboard');
                                        }
                                    }
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-red-500/20"
                            >
                                <Trophy className="w-5 h-5" />
                                Finish Quiz
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-bar mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${(completedCount / challenges.length) * 100}%` }}
                        ></div>
                    </div>

                    {/* Challenge Navigation */}
                    <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {challenges.map((c, idx) => (
                            <button
                                key={c._id}
                                onClick={() => !c.completed && setCurrentIndex(idx)}
                                disabled={c.completed}
                                className={`question-nav-btn ${idx === currentIndex
                                    ? 'active'
                                    : c.completed
                                        ? 'completed opacity-50 cursor-not-allowed'
                                        : 'unanswered'
                                    }`}
                                title={c.completed ? 'Already completed' : `Question ${idx + 1}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    {/* Main Content */}
                    {currentChallenge && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left: Challenge Info */}
                            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                <div className="card">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-white">{currentChallenge.title}</h2>
                                        <span className={`badge ${getDifficultyColor(currentChallenge.difficulty)}`}>
                                            {currentChallenge.difficulty}
                                        </span>
                                    </div>
                                    <p className="text-white/70 mb-4">{currentChallenge.description}</p>
                                    <div className="flex items-center gap-4 text-sm text-white/50">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" /> {currentChallenge.testCaseCount} tests
                                        </span>
                                        <span className="text-red-400 font-bold">{currentChallenge.points} points</span>
                                    </div>
                                </div>

                                {/* Hint Section */}
                                <div className="card">
                                    <button
                                        onClick={handleGetHint}
                                        disabled={hintIndex >= (currentChallenge.hints?.length || 0) - 1}
                                        className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors disabled:opacity-50"
                                    >
                                        <Lightbulb className="w-5 h-5" />
                                        Get Hint ({hintIndex + 1}/{currentChallenge.hints?.length || 0})
                                    </button>
                                    {currentHint && (
                                        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-200 text-sm">
                                            💡 {currentHint}
                                        </div>
                                    )}
                                </div>

                                {/* Results */}
                                {result && (
                                    <div className={`card border ${getStatusColor(result.status)}`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            {getStatusIcon(result.status)}
                                            <span className="font-bold capitalize">
                                                {result.status.replace('_', ' ')}
                                            </span>
                                            {result.status === 'accepted' && (
                                                <>
                                                    <span className="ml-auto text-green-400 font-bold">+{result.score}</span>
                                                    {countdown !== null && (
                                                        <span className="ml-2 px-2 py-1 bg-red-600/30 rounded text-red-300 text-sm">
                                                            Next in {countdown}s
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* Compilation Error */}
                                        {!result.compilationResult.success && (
                                            <div className="mb-4 p-3 bg-red-900/30 rounded-lg font-bold text-red-400">
                                                Compilation Error
                                            </div>
                                        )}

                                        {/* Test Results */}
                                        {result.compilationResult.success && (
                                            <div className="space-y-2">
                                                <div className="text-sm text-white/60 mb-2">
                                                    Passed: {result.passedTests}/{result.totalTests}
                                                </div>
                                                {result.testResults.map((test, i) => (
                                                    <div
                                                        key={i}
                                                        className={`p-2 rounded-lg text-sm flex items-start gap-2 ${test.passed
                                                            ? 'bg-green-500/10 text-green-300'
                                                            : 'bg-red-500/10 text-red-300'
                                                            }`}
                                                    >
                                                        {test.passed ? (
                                                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium">
                                                                Test {i + 1}: <code className="bg-white/10 px-1 rounded text-xs ml-2">{test.input}</code> {test.isHidden && '(Hidden)'}
                                                            </div>
                                                            {!test.passed && !test.isHidden && (
                                                                <div className="mt-1 text-xs">
                                                                    {test.error ? (
                                                                        <div className="text-red-300">Error: {test.error}</div>
                                                                    ) : (
                                                                        <>
                                                                            <div>Expected: <code className="bg-white/10 px-1 rounded">{test.expectedOutput}</code></div>
                                                                            <div>Got: <code className="bg-white/10 px-1 rounded">{test.actualOutput || '(empty)'}</code></div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-white/40">{test.executionTime}ms</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right: Code Editor or Success Message */}
                            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                {result?.status === 'accepted' ? (
                                    /* Success State - Hide editor, show success */
                                    <div className="card h-full flex flex-col items-center justify-center text-center py-12">
                                        <div className="text-6xl mb-6">🎉</div>
                                        <h3 className="text-2xl font-bold text-green-400 mb-2">Correct Answer!</h3>
                                        <p className="text-white/60 mb-4">You've solved this challenge.</p>
                                        <div className="text-3xl font-bold text-red-400 mb-6">+{result.score} points</div>
                                        {countdown !== null && currentIndex < challenges.length - 1 && (
                                            <div className="px-4 py-2 bg-red-600/30 rounded-lg text-red-300">
                                                Moving to next question in {countdown}s...
                                            </div>
                                        )}
                                        {currentIndex === challenges.length - 1 && (
                                            <div className="px-4 py-2 bg-green-600/30 rounded-lg text-green-300">
                                                🏆 This was the last question!
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* Editor State - Show code editor */
                                    <div className="card h-full flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-white">Fix the Code</h3>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={handleSubmit}
                                                    disabled={submitting || !code.trim()}
                                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                >
                                                    <Play className="w-3 h-3" />
                                                    {submitting ? 'Running...' : 'Submit'}
                                                </button>
                                                <button
                                                    onClick={() => setCode(originalCode)}
                                                    className="text-sm text-white/50 hover:text-white transition-colors"
                                                >
                                                    Reset Code
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 min-h-[400px]">
                                            <CodeEditor
                                                value={code}
                                                onChange={setCode}
                                                language={currentChallenge.programmingLanguage}
                                                height="400px"
                                            />
                                        </div>

                                        <div className="mt-4 flex items-center gap-4">
                                            <button
                                                onClick={handleSubmit}
                                                disabled={submitting || !code.trim()}
                                                className="btn-primary flex-1 flex items-center justify-center gap-2"
                                            >
                                                {submitting ? (
                                                    <>Running Tests...</>
                                                ) : (
                                                    <>
                                                        <Play className="w-5 h-5" />
                                                        Submit Solution
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Navigation */}
                                        <div className="mt-4 flex items-center justify-between">
                                            <button
                                                onClick={() => {
                                                    // Find previous non-completed question
                                                    let prevIdx = currentIndex - 1;
                                                    while (prevIdx >= 0 && challenges[prevIdx]?.completed) {
                                                        prevIdx--;
                                                    }
                                                    if (prevIdx >= 0) setCurrentIndex(prevIdx);
                                                }}
                                                disabled={currentIndex === 0 || challenges.slice(0, currentIndex).every(c => c.completed)}
                                                className="flex items-center gap-1 text-white/50 hover:text-white disabled:opacity-30 transition-colors"
                                            >
                                                <ChevronLeft className="w-5 h-5" /> Previous
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Find next non-completed question
                                                    let nextIdx = currentIndex + 1;
                                                    while (nextIdx < challenges.length && challenges[nextIdx]?.completed) {
                                                        nextIdx++;
                                                    }
                                                    if (nextIdx < challenges.length) setCurrentIndex(nextIdx);
                                                }}
                                                disabled={currentIndex === challenges.length - 1 || challenges.slice(currentIndex + 1).every(c => c.completed)}
                                                className="flex items-center gap-1 text-white/50 hover:text-white disabled:opacity-30 transition-colors"
                                            >
                                                Next <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </RainingLetters >
    );
}
