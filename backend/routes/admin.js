const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question');
const AnswerLog = require('../models/AnswerLog');
const Submission = require('../models/Submission');
const CodeChallenge = require('../models/CodeChallenge');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All admin routes require authentication AND admin role
router.use(auth);
router.use(roleCheck(['ADMIN']));

/**
 * @route   GET /api/admin/users
 * @desc    Get all registered users
 * @access  Admin only
 */
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ role: 'USER' })
            .select('-password')
            .sort({ createdAt: -1 });

        const usersWithStats = await Promise.all(users.map(async (user) => {
            const attemptCount = await AnswerLog.countDocuments({ userId: user._id });
            return {
                _id: user._id,
                username: user.username,
                role: user.role,
                selectedProgrammingLanguage: user.selectedProgrammingLanguage,
                totalScore: user.totalScore,
                completedQuestions: user.completedQuestions.length,
                quizStarted: user.quizStarted,
                totalAttempts: attemptCount,
                createdAt: user.createdAt
            };
        }));

        res.json({
            success: true,
            data: {
                users: usersWithStats,
                totalUsers: usersWithStats.length
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get specific user details
 * @access  Admin only
 */
router.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select('-password')
            .populate('completedQuestions', 'questionText difficulty programmingLanguage');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get total questions for user's selected language
        let totalQuestions = 0;
        if (user.selectedProgrammingLanguage) {
            totalQuestions = await Question.countDocuments({
                programmingLanguage: user.selectedProgrammingLanguage
            });
        }

        // Get attempt count
        const attemptCount = await AnswerLog.countDocuments({ userId: user._id });

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    selectedProgrammingLanguage: user.selectedProgrammingLanguage,
                    totalScore: user.totalScore,
                    completedQuestions: user.completedQuestions,
                    completedCount: user.completedQuestions.length,
                    totalQuestions,
                    quizStarted: user.quizStarted,
                    totalAttempts: attemptCount,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/admin/users/:id/logs
 * @desc    Get detailed code submission logs for a specific user
 * @access  Admin only
 */
router.get('/users/:id/logs', async (req, res) => {
    try {
        const { id } = req.params;

        // Verify user exists
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get all code submissions for this user
        const submissions = await Submission.find({ userId: id })
            .populate('challengeId', 'title description programmingLanguage difficulty points')
            .sort({ createdAt: -1 });

        // Group submissions by challenge to show multiple attempts
        const challengeAttempts = {};
        submissions.forEach(sub => {
            if (!sub.challengeId) return; // Skip if challenge was deleted

            const cId = sub.challengeId._id.toString();
            if (!challengeAttempts[cId]) {
                challengeAttempts[cId] = {
                    challenge: {
                        id: sub.challengeId._id,
                        title: sub.challengeId.title,
                        description: sub.challengeId.description,
                        language: sub.challengeId.programmingLanguage,
                        difficulty: sub.challengeId.difficulty,
                        points: sub.challengeId.points
                    },
                    attempts: [],
                    isCompleted: false
                };
            }
            challengeAttempts[cId].attempts.push({
                id: sub._id,
                submittedCode: sub.submittedCode,
                status: sub.status,
                passedTests: sub.passedTests,
                totalTests: sub.totalTests,
                score: sub.score,
                compilationResult: sub.compilationResult,
                testResults: sub.testResults,
                timestamp: sub.createdAt
            });
            if (sub.status === 'accepted') {
                challengeAttempts[cId].isCompleted = true;
            }
        });

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    totalScore: user.totalScore,
                    selectedProgrammingLanguage: user.selectedProgrammingLanguage
                },
                logs: Object.values(challengeAttempts),
                summary: {
                    totalChallenges: Object.keys(challengeAttempts).length,
                    completedChallenges: Object.values(challengeAttempts).filter(c => c.isCompleted).length,
                    totalAttempts: submissions.length,
                    acceptedAttempts: submissions.filter(s => s.status === 'accepted').length,
                    failedAttempts: submissions.filter(s => s.status !== 'accepted').length
                }
            }
        });
    } catch (error) {
        console.error('Get user logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/admin/leaderboard
 * @desc    Get leaderboard sorted by score
 * @access  Admin only
 */
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find({ role: 'USER' })
            .select('-password')
            .sort({ totalScore: -1, createdAt: 1 }); // Sort by score desc, then by join date

        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            _id: user._id,
            username: user.username,
            totalScore: user.totalScore,
            completedQuestions: user.completedQuestions.length,
            selectedProgrammingLanguage: user.selectedProgrammingLanguage || 'Not selected',
            quizStarted: user.quizStarted
        }));

        res.json({
            success: true,
            data: {
                leaderboard,
                totalParticipants: leaderboard.length
            }
        });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/admin/stats
 * @desc    Get overall quiz statistics (Code Challenges)
 * @access  Admin only
 */
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'USER' });
        const activeUsers = await User.countDocuments({ role: 'USER', quizStarted: true });
        const totalQuestions = await CodeChallenge.countDocuments();
        const totalAnswerLogs = await Submission.countDocuments();
        const acceptedSubmissions = await Submission.countDocuments({ status: 'accepted' });

        // Calculate average score across users
        const scoreResult = await User.aggregate([
            { $match: { role: 'USER' } },
            { $group: { _id: null, avgScore: { $avg: '$totalScore' } } }
        ]);
        const averageScore = scoreResult.length > 0 ? Math.round(scoreResult[0].avgScore || 0) : 0;

        // Challenges per language
        const challengesPerLanguage = await CodeChallenge.aggregate([
            { $group: { _id: '$programmingLanguage', count: { $sum: 1 } } }
        ]);

        // Users per language
        const usersPerLanguage = await User.aggregate([
            { $match: { role: 'USER', selectedProgrammingLanguage: { $ne: null } } },
            { $group: { _id: '$selectedProgrammingLanguage', count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                totalQuestions,
                totalAnswerLogs,
                acceptedSubmissions,
                averageScore,
                accuracy: totalAnswerLogs > 0 ? ((acceptedSubmissions / totalAnswerLogs) * 100).toFixed(2) : 0,
                challengesPerLanguage,
                usersPerLanguage
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   POST /api/admin/reset-database
 * @desc    Wipe database and re-seed
 * @access  Admin only
 */
router.post('/reset-database', async (req, res) => {
    try {
        const { exec } = require('child_process');
        const path = require('path');
        const seedPath = path.join(__dirname, '../seeds/seed.js');

        exec(`node "${seedPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).json({
                    success: false,
                    message: 'Database reset failed: ' + error.message
                });
            }
            console.log(`stdout: ${stdout}`);
            if (stderr) console.error(`stderr: ${stderr}`);

            res.json({
                success: true,
                message: 'Database reset successfully. All data wiped and initial data restored.'
            });
        });
    } catch (error) {
        console.error('Reset database error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user and their logs
 * @access  Admin only
 */
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deleting other admins (optional safeguard)
        if (user.role === 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin users'
            });
        }

        // Delete user's answer logs
        await AnswerLog.deleteMany({ userId: id });

        // Delete user's code submissions
        await Submission.deleteMany({ userId: id });

        // Delete the user
        await User.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'User and associated data deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
});

/**
 * @route   GET /api/admin/submissions
 * @desc    Get all code challenge submissions with user and challenge details
 * @access  Admin only
 */
router.get('/submissions', async (req, res) => {
    try {
        const { userId, challengeId, status, limit = 100 } = req.query;

        // Build query filter
        const filter = {};
        if (userId) filter.userId = userId;
        if (challengeId) filter.challengeId = challengeId;
        if (status) filter.status = status;

        const submissions = await Submission.find(filter)
            .populate('userId', 'username email')
            .populate('challengeId', 'title programmingLanguage difficulty points')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        // Calculate summary stats
        const totalSubmissions = await Submission.countDocuments(filter);
        const acceptedCount = await Submission.countDocuments({ ...filter, status: 'accepted' });
        const failedCount = totalSubmissions - acceptedCount;

        res.json({
            success: true,
            data: {
                submissions: submissions.map(s => ({
                    id: s._id,
                    user: s.userId ? {
                        id: s.userId._id,
                        username: s.userId.username,
                        email: s.userId.email
                    } : null,
                    challenge: s.challengeId ? {
                        id: s.challengeId._id,
                        title: s.challengeId.title,
                        language: s.challengeId.programmingLanguage,
                        difficulty: s.challengeId.difficulty,
                        points: s.challengeId.points
                    } : null,
                    submittedCode: s.submittedCode,
                    programmingLanguage: s.programmingLanguage,
                    compilationResult: s.compilationResult,
                    testResults: s.testResults,
                    passedTests: s.passedTests,
                    totalTests: s.totalTests,
                    score: s.score,
                    status: s.status,
                    createdAt: s.createdAt
                })),
                summary: {
                    total: totalSubmissions,
                    accepted: acceptedCount,
                    failed: failedCount,
                    successRate: totalSubmissions > 0 ? ((acceptedCount / totalSubmissions) * 100).toFixed(2) : 0
                }
            }
        });
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/admin/submissions/:id
 * @desc    Get a single submission details
 * @access  Admin only
 */
router.get('/submissions/:id', async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate('userId', 'username email')
            .populate('challengeId', 'title description programmingLanguage difficulty points buggyCode solutionCode');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        res.json({
            success: true,
            data: {
                submission: {
                    id: submission._id,
                    user: submission.userId,
                    challenge: submission.challengeId,
                    submittedCode: submission.submittedCode,
                    programmingLanguage: submission.programmingLanguage,
                    compilationResult: submission.compilationResult,
                    testResults: submission.testResults,
                    passedTests: submission.passedTests,
                    totalTests: submission.totalTests,
                    score: submission.score,
                    status: submission.status,
                    createdAt: submission.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Get submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
