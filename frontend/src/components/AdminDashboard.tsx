import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DottedSurface } from './ui/dotted-surface';
import { Users, Trophy, BarChart3, FileText, ChevronRight, X, Clock, CheckCircle2, XCircle, Trash2, AlertTriangle } from 'lucide-react';

interface User {
    _id: string;
    username: string;
    role: string;
    selectedProgrammingLanguage: string | null;
    totalScore: number;
    quizStarted: boolean;
    completedQuestions: number;
}

interface Stats {
    totalUsers: number;
    totalQuestions: number;
    totalAnswerLogs: number;
    averageScore: number;
}

// Interfaces for User Logs (Code Submissions)
interface SubmissionAttempt {
    id: string;
    submittedCode: string;
    status: 'compilation_error' | 'runtime_error' | 'wrong_answer' | 'accepted' | 'partial';
    passedTests: number;
    totalTests: number;
    score: number;
    timestamp: string;
}

interface UserDetails {
    username: string;
    email: string;
    totalScore: number;
    selectedProgrammingLanguage: string;
    completedQuestions: number;
}

interface GroupedLogs {
    challenge: {
        id: string;
        title: string;
        description: string;
        language: string;
        difficulty: string;
        points: number;
    };
    attempts: SubmissionAttempt[];
    isCompleted: boolean;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [groupedLogs, setGroupedLogs] = useState<GroupedLogs[]>([]);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

    // Delete State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, statsRes] = await Promise.all([
                    axios.get('/admin/users'),
                    axios.get('/admin/stats')
                ]);
                setUsers(usersRes.data.data.users);
                setStats(statsRes.data.data);
            } catch (err) {
                console.error('Failed to fetch admin data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Fetch logs when a user is selected
    const handleViewLogs = async (userId: string) => {
        setSelectedUserId(userId);
        setShowModal(true);
        setModalLoading(true);
        try {
            const res = await axios.get(`/admin/users/${userId}/logs`);
            setGroupedLogs(res.data.data.logs);
            setUserDetails(res.data.data.user);
        } catch (err) {
            console.error('Failed to fetch user logs');
        } finally {
            setModalLoading(false);
        }
    };

    const confirmDelete = (user: User) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            await axios.delete(`/admin/users/${userToDelete._id}`);
            // Remove user from state
            setUsers(users.filter(u => u._id !== userToDelete._id));
            setShowDeleteModal(false);
            setUserToDelete(null);

            // Refresh stats
            const statsRes = await axios.get('/admin/stats');
            setStats(statsRes.data.data);
        } catch (err: any) {
            console.error('Failed to delete user', err);
            const errorMessage = err.response?.data?.message || 'Failed to delete user. Please try again.';
            alert(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUserId(null);
        setGroupedLogs([]);
        setUserDetails(null);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'badge-success';
            case 'medium': return 'badge-warning';
            case 'hard': return 'badge-danger';
            default: return 'badge-info';
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <DottedSurface>
            <div className="min-h-screen pt-20 pb-10 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 animate-fade-in-up">
                        <h1 className="text-4xl font-bold text-white glow-text mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-white/60">
                            Monitor quiz progress and manage users
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-red-500/20">
                                    <Users className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <div className="stat-value">{stats?.totalUsers || 0}</div>
                                    <div className="stat-label">Total Users</div>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-500/20">
                                    <FileText className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <div className="stat-value">{stats?.totalQuestions || 0}</div>
                                    <div className="stat-label">Total Questions</div>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-green-500/20">
                                    <BarChart3 className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <div className="stat-value">{stats?.totalAnswerLogs || 0}</div>
                                    <div className="stat-label">Total Attempts</div>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-yellow-500/20">
                                    <Trophy className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <div className="stat-value">{stats?.averageScore?.toFixed(0) || 0}</div>
                                    <div className="stat-label">Avg Score</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="card animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Registered Users</h2>
                            <Link to="/leaderboard" className="btn-secondary text-sm flex items-center gap-2">
                                <Trophy className="w-4 h-4" />
                                View Leaderboard
                            </Link>
                        </div>

                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Role</th>
                                        <th>Language</th>
                                        <th>Score</th>
                                        <th>Progress</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td className="font-medium">{user.username}</td>
                                            <td>
                                                <span className={`badge ${user.role === 'ADMIN' ? 'badge-purple' : 'badge-info'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                {user.selectedProgrammingLanguage || (
                                                    <span className="text-white/40">Not selected</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className="font-bold text-red-400">{user.totalScore}</span>
                                            </td>
                                            <td>
                                                <span className={`badge ${user.quizStarted ? 'badge-success' : 'badge-warning'}`}>
                                                    {user.quizStarted ? `${user.completedQuestions}/9 done` : 'Not started'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleViewLogs(user._id)}
                                                        className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                                        title="View Logs"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Logs</span>
                                                    </button>
                                                    {user.role !== 'ADMIN' && (
                                                        <button
                                                            onClick={() => confirmDelete(user)}
                                                            className="flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logs Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a2e] border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-in-up">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-2xl font-bold text-white">
                                {modalLoading ? 'Loading Logs...' : userDetails ? `Logs: ${userDetails.username}` : 'User Logs'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {modalLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="spinner"></div>
                                </div>
                            ) : !userDetails ? (
                                <div className="text-center py-12 text-white/60">
                                    Failed to load user details.
                                </div>
                            ) : (
                                <>
                                    {/* User Summary */}
                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                            <div className="text-sm text-white/60 mb-1">Total Score</div>
                                            <div className="text-2xl font-bold text-red-400">{userDetails.totalScore}</div>
                                        </div>
                                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                            <div className="text-sm text-white/60 mb-1">Language</div>
                                            <div className="text-xl font-medium text-white">{userDetails.selectedProgrammingLanguage || 'N/A'}</div>
                                        </div>
                                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                            <div className="text-sm text-white/60 mb-1">Questions</div>
                                            <div className="text-xl font-medium text-white">{userDetails.completedQuestions}</div>
                                        </div>
                                    </div>

                                    {/* Logs List */}
                                    {groupedLogs.length === 0 ? (
                                        <div className="text-center py-10 text-white/60 bg-white/5 rounded-xl border border-dashed border-white/10">
                                            No submission attempts recorded yet.
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {groupedLogs.map((group) => (
                                                <div key={group.challenge.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                                                    <div className="p-4 bg-white/5 border-b border-white/10">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="font-medium text-white">{group.challenge.title}</h3>
                                                            <div className="flex items-center gap-2">
                                                                {group.isCompleted && (
                                                                    <span className="badge bg-green-500/20 text-green-400 border-green-500/30">Solved</span>
                                                                )}
                                                                <span className={`badge ${getDifficultyColor(group.challenge.difficulty)}`}>
                                                                    {group.challenge.difficulty}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-white/50">{group.challenge.language} • {group.challenge.points} points</p>
                                                    </div>
                                                    <div className="divide-y divide-white/5">
                                                        {group.attempts.map((attempt, attemptIdx) => (
                                                            <div key={attempt.id} className="p-4 hover:bg-white/5 transition-colors">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center gap-3">
                                                                        {attempt.status === 'accepted'
                                                                            ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                                                                            : <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                                                                        }
                                                                        <div>
                                                                            <div className="text-sm text-white">
                                                                                <span className="text-white/40 mr-2">#{attemptIdx + 1}</span>
                                                                                <span className={`px-2 py-0.5 rounded text-xs ${attempt.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                                                                    attempt.status === 'compilation_error' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                                        'bg-red-500/20 text-red-400'
                                                                                    }`}>
                                                                                    {attempt.status.replace('_', ' ').toUpperCase()}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
                                                                                <Clock className="w-3 h-3" />
                                                                                {formatTime(attempt.timestamp)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="text-sm text-white/70">
                                                                            {attempt.passedTests}/{attempt.totalTests} tests
                                                                        </div>
                                                                        {attempt.status === 'accepted' && (
                                                                            <span className="text-green-400 font-bold text-sm">
                                                                                +{attempt.score}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {/* Code Preview */}
                                                                <details className="mt-2">
                                                                    <summary className="text-xs text-white/40 cursor-pointer hover:text-white/60">View Submitted Code</summary>
                                                                    <pre className="mt-2 p-3 bg-black/50 rounded-lg text-xs text-white/70 overflow-x-auto max-h-40 overflow-y-auto">
                                                                        <code>{attempt.submittedCode}</code>
                                                                    </pre>
                                                                </details>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a2e] border border-red-500/30 rounded-xl w-full max-w-md shadow-2xl animate-fade-in-up">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-full bg-red-500/20 text-red-500">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Delete User?</h2>
                            </div>

                            <p className="text-white/70 mb-6">
                                Are you sure you want to delete <span className="font-bold text-white">{userToDelete.username}</span>? This action cannot be undone and will remove all their quiz progress and logs.
                            </p>

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setUserToDelete(null);
                                    }}
                                    className="px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteUser}
                                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors flex items-center gap-2"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete User'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DottedSurface>
    );
}
