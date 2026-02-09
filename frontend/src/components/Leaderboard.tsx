import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Award, Crown, Target, Flame, Star } from 'lucide-react';

interface LeaderboardEntry {
    _id: string;
    username: string;
    totalScore: number;
    selectedProgrammingLanguage: string;
    completedQuestions: number;
    rank: number;
}

export default function Leaderboard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get('/admin/leaderboard');
                setEntries(res.data.data.leaderboard);
            } catch (err) {
                console.error('Failed to fetch leaderboard');
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="w-6 h-6 text-yellow-400" />;
            case 2:
                return <Medal className="w-6 h-6 text-gray-300" />;
            case 3:
                return <Award className="w-6 h-6 text-orange-400" />;
            default:
                return <span className="text-lg font-bold text-white/60">#{rank}</span>;
        }
    };

    const getMaxScore = () => {
        return entries.length > 0 ? Math.max(...entries.map(e => e.totalScore)) : 100;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    const topThree = entries.slice(0, 3);
    const restOfList = entries.slice(3);
    const maxScore = getMaxScore();

    return (
        <div className="min-h-screen pt-20 pb-10 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/30 mb-4 border border-yellow-500/30">
                        <Trophy className="w-12 h-12 text-yellow-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white glow-text mb-2">
                        Leaderboard
                    </h1>
                    <p className="text-white/60">
                        Top debuggers ranked by score
                    </p>
                </div>

                {entries.length === 0 ? (
                    /* Empty State */
                    <div className="card text-center py-16 animate-fade-in-up">
                        <div className="inline-flex items-center justify-center p-6 rounded-full bg-red-500/10 mb-6">
                            <Target className="w-16 h-16 text-red-400/50" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No Scores Yet</h3>
                        <p className="text-white/50 mb-6">Be the first to complete a challenge and claim the top spot!</p>
                        <div className="inline-flex items-center gap-2 text-red-400">
                            <Flame className="w-5 h-5" />
                            <span>Start debugging to compete</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Podium for Top 3 */}
                        {topThree.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                {/* 2nd Place */}
                                <div className={`flex flex-col items-center ${topThree.length > 1 ? '' : 'invisible'}`}>
                                    <div className="mt-8">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400/30 to-gray-500/30 border-2 border-gray-400/50 flex items-center justify-center mb-3 mx-auto">
                                            <span className="text-2xl font-bold text-gray-300">2</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-white truncate max-w-[120px]">{topThree[1]?.username}</div>
                                            <div className="text-2xl font-bold text-gray-300">{topThree[1]?.totalScore}</div>
                                            <div className="text-xs text-white/40">{topThree[1]?.selectedProgrammingLanguage}</div>
                                        </div>
                                    </div>
                                    <div className="w-full h-24 mt-4 bg-gradient-to-t from-gray-600/30 to-gray-500/20 rounded-t-lg border-t border-x border-gray-500/30"></div>
                                </div>

                                {/* 1st Place */}
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />
                                        </div>
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400/40 to-orange-500/40 border-2 border-yellow-400 flex items-center justify-center mb-3 mt-2 mx-auto shadow-lg shadow-yellow-500/20">
                                            <span className="text-3xl font-bold text-yellow-300">1</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-white text-lg truncate max-w-[140px]">{topThree[0]?.username}</div>
                                            <div className="text-3xl font-bold text-yellow-400">{topThree[0]?.totalScore}</div>
                                            <div className="text-xs text-white/40">{topThree[0]?.selectedProgrammingLanguage}</div>
                                        </div>
                                    </div>
                                    <div className="w-full h-32 mt-4 bg-gradient-to-t from-yellow-600/30 to-yellow-500/20 rounded-t-lg border-t border-x border-yellow-500/30"></div>
                                </div>

                                {/* 3rd Place */}
                                <div className={`flex flex-col items-center ${topThree.length > 2 ? '' : 'invisible'}`}>
                                    <div className="mt-12">
                                        <div className="w-18 h-18 rounded-full bg-gradient-to-br from-orange-400/30 to-orange-600/30 border-2 border-orange-500/50 flex items-center justify-center mb-3 mx-auto w-16 h-16">
                                            <span className="text-xl font-bold text-orange-300">3</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-white truncate max-w-[120px]">{topThree[2]?.username}</div>
                                            <div className="text-xl font-bold text-orange-400">{topThree[2]?.totalScore}</div>
                                            <div className="text-xs text-white/40">{topThree[2]?.selectedProgrammingLanguage}</div>
                                        </div>
                                    </div>
                                    <div className="w-full h-16 mt-4 bg-gradient-to-t from-orange-600/30 to-orange-500/20 rounded-t-lg border-t border-x border-orange-500/30"></div>
                                </div>
                            </div>
                        )}

                        {/* Rest of Leaderboard */}
                        {restOfList.length > 0 && (
                            <div className="card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                                    <Star className="w-5 h-5 text-red-400" />
                                    <span className="font-medium text-white">Other Competitors</span>
                                </div>
                                <div className="space-y-3">
                                    {restOfList.map((entry, idx) => (
                                        <div
                                            key={entry._id}
                                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                                            style={{ animationDelay: `${0.1 * (idx + 3)}s` }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                    {getRankIcon(idx + 4)}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="font-medium text-white truncate">{entry.username}</div>
                                                        <div className="text-lg font-bold text-red-400">{entry.totalScore}</div>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                                                        <span>{entry.selectedProgrammingLanguage || 'No language'} • {entry.completedQuestions} solved</span>
                                                        <span>points</span>
                                                    </div>
                                                    {/* Progress Bar */}
                                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                                            style={{ width: `${(entry.totalScore / maxScore) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats Summary */}
                        <div className="mt-6 grid grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <div className="text-2xl font-bold text-white">{entries.length}</div>
                                <div className="text-xs text-white/50">Total Players</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <div className="text-2xl font-bold text-yellow-400">{maxScore}</div>
                                <div className="text-xs text-white/50">Top Score</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <div className="text-2xl font-bold text-red-400">
                                    {entries.reduce((sum, e) => sum + e.completedQuestions, 0)}
                                </div>
                                <div className="text-xs text-white/50">Total Solved</div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

