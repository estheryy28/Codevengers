import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Entry from './components/Entry';
import Login from './components/Login';
import Register from './components/Register';
import LanguageSelect from './components/LanguageSelect';
import Quiz from './components/Quiz';
import AdminDashboard from './components/AdminDashboard';

import Leaderboard from './components/Leaderboard';
import { LogOut, Trophy, LayoutDashboard, BookOpen } from 'lucide-react';

// Navigation Component
function Navigation() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <nav className="nav-container">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="text-xl font-bold text-white glow-text">
                        Codevengers
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-4">
                        <span className="text-white/60 text-sm">
                            {user.username}
                            <span className="ml-2 badge badge-purple text-xs">{user.role}</span>
                        </span>

                        <span className="text-red-400 font-bold">
                            Score: {user.totalScore}
                        </span>

                        {user.role === 'ADMIN' && (
                            <>
                                <Link to="/admin" className="nav-link flex items-center gap-2">
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>
                                <Link to="/leaderboard" className="nav-link flex items-center gap-2">
                                    <Trophy className="w-4 h-4" />
                                    Leaderboard
                                </Link>
                            </>
                        )}

                        {user.role === 'USER' && user.quizStarted && (
                            <Link to="/quiz" className="nav-link flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Quiz
                            </Link>
                        )}

                        <button
                            onClick={logout}
                            className="nav-link flex items-center gap-2 text-red-400 hover:text-red-300"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

// Home Router - redirects based on user role and state
function HomeRouter() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) {
        return <Entry />;
    }

    if (user.role === 'ADMIN') {
        return <Navigate to="/admin" replace />;
    }

    if (!user.selectedProgrammingLanguage) {
        return <Navigate to="/select-language" replace />;
    }

    return <Navigate to="/quiz" replace />;
}

// Main App Component
function AppContent() {
    return (
        <>
            <Navigation />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomeRouter />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* User Routes */}
                <Route
                    path="/select-language"
                    element={
                        <ProtectedRoute>
                            <LanguageSelect />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/quiz"
                    element={
                        <ProtectedRoute>
                            <Quiz />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute adminOnly>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/leaderboard"
                    element={
                        <ProtectedRoute adminOnly>
                            <Leaderboard />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default function App() {
    return <AppContent />;
}
