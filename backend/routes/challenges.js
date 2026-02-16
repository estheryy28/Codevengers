const express = require('express');
const router = express.Router();
const CodeChallenge = require('../models/CodeChallenge');
const Submission = require('../models/Submission');
const User = require('../models/User');
const auth = require('../middleware/auth');
const codeExecutor = require('../services/codeExecutor');

// All routes require authentication
router.use(auth);

/**
 * @route   GET /api/challenges/languages
 * @desc    Get available programming languages
 * @access  Authenticated
 */
router.get('/languages', (req, res) => {
    res.json({
        success: true,
        data: {
            languages: ['C', 'C++', 'Java', 'Python']
        }
    });
});

/**
 * @route   POST /api/challenges/select-language
 * @desc    Select programming language and start challenges
 * @access  Authenticated
 */
router.post('/select-language', async (req, res) => {
    try {
        const { language } = req.body;
        const validLanguages = ['C', 'C++', 'Java', 'Python'];

        if (!validLanguages.includes(language)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid programming language'
            });
        }

        // Update user's selected language
        await User.findByIdAndUpdate(req.user._id, {
            selectedProgrammingLanguage: language,
            quizStarted: true
        });

        res.json({
            success: true,
            message: `Selected ${language} successfully`
        });
    } catch (error) {
        console.error('Select language error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/challenges
 * @desc    Get all challenges for user's selected language
 * @access  Authenticated
 */
router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user.selectedProgrammingLanguage) {
            return res.status(400).json({
                success: false,
                message: 'Please select a programming language first'
            });
        }

        const crypto = require('crypto');

        // Get challenges for user's language
        const challenges = await CodeChallenge.find({
            programmingLanguage: user.selectedProgrammingLanguage
        }).select('title description difficulty points');

        // Get user's submissions to mark completed challenges
        const submissions = await Submission.find({
            userId: user._id,
            status: 'accepted'
        }).select('challengeId');

        const completedIds = new Set(submissions.map(s => s.challengeId.toString()));

        // Deterministic shuffle based on User ID
        // We hash (userId + challengeId) and sort by the hash to get a consistent random order per user
        const challengesWithStatus = challenges.map(c => {
            const hash = crypto.createHash('md5').update(`${user._id}-${c._id}`).digest('hex');
            return {
                _id: c._id,
                title: c.title,
                description: c.description,
                difficulty: c.difficulty,
                points: c.points,
                completed: completedIds.has(c._id.toString()),
                sortHash: hash // Temporary for sorting
            };
        }).sort((a, b) => a.sortHash.localeCompare(b.sortHash))
            .map(({ sortHash, ...rest }) => rest); // Remove temporary hash

        res.json({
            success: true,
            data: {
                challenges: challengesWithStatus,
                totalChallenges: challenges.length,
                completedChallenges: completedIds.size
            }
        });
    } catch (error) {
        console.error('Get challenges error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/challenges/:id
 * @desc    Get a specific challenge (with buggy code)
 * @access  Authenticated
 */
router.get('/:id', async (req, res) => {
    try {
        const challenge = await CodeChallenge.findById(req.params.id)
            .select('-solutionCode -testCases.expectedOutput');

        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: 'Challenge not found'
            });
        }

        // Check if user has selected the right language
        const user = await User.findById(req.user._id);
        if (user.selectedProgrammingLanguage !== challenge.programmingLanguage) {
            return res.status(403).json({
                success: false,
                message: 'This challenge is not for your selected language'
            });
        }

        // Get user's previous submissions for this challenge
        const previousSubmissions = await Submission.find({
            userId: req.user._id,
            challengeId: challenge._id
        }).sort({ createdAt: -1 }).limit(5).select('status passedTests totalTests createdAt');

        res.json({
            success: true,
            data: {
                challenge: {
                    _id: challenge._id,
                    title: challenge.title,
                    description: challenge.description,
                    programmingLanguage: challenge.programmingLanguage,
                    difficulty: challenge.difficulty,
                    buggyCode: challenge.buggyCode,
                    hints: challenge.hints,
                    testCaseCount: challenge.testCases.length,
                    points: challenge.points,
                    timeLimit: challenge.timeLimit,
                    memoryLimit: challenge.memoryLimit
                },
                previousSubmissions
            }
        });
    } catch (error) {
        console.error('Get challenge error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   POST /api/challenges/:id/submit
 * @desc    Submit code fix for evaluation
 * @access  Authenticated
 */
router.post('/:id/submit', async (req, res) => {
    try {
        const { code } = req.body;

        if (!code || code.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Code is required'
            });
        }

        const challenge = await CodeChallenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: 'Challenge not found'
            });
        }

        // Run code against test cases
        const testResult = await codeExecutor.runTestCases(
            code,
            challenge.programmingLanguage,
            challenge.testCases
        );

        // Calculate score
        let score = 0;
        if (testResult.status === 'accepted') {
            score = challenge.points;
        } else if (testResult.status === 'partial') {
            score = Math.floor(challenge.points * (testResult.passedTests / testResult.totalTests));
        }

        // Create submission record
        const submission = new Submission({
            userId: req.user._id,
            challengeId: challenge._id,
            submittedCode: code,
            programmingLanguage: challenge.programmingLanguage,
            compilationResult: testResult.compilationResult,
            testResults: testResult.testResults,
            passedTests: testResult.passedTests,
            totalTests: testResult.totalTests,
            score,
            status: testResult.status
        });

        await submission.save();

        // Update user score if accepted (first time)
        if (testResult.status === 'accepted') {
            const previousAccepted = await Submission.findOne({
                userId: req.user._id,
                challengeId: challenge._id,
                status: 'accepted',
                _id: { $ne: submission._id }
            });

            if (!previousAccepted) {
                const updatedUser = await User.findByIdAndUpdate(req.user._id, {
                    $inc: { totalScore: score },
                    $addToSet: { completedQuestions: challenge._id }
                }, { new: true });

                // Check if user has completed all challenges
                const totalChallenges = await CodeChallenge.countDocuments({
                    programmingLanguage: challenge.programmingLanguage
                });

                if (updatedUser.completedQuestions.length === totalChallenges) {
                    updatedUser.quizStarted = false;
                    await updatedUser.save();
                }

                // Reduce challenge points by 5 for future submissions (minimum 10 points)
                if (challenge.points > 10) {
                    await CodeChallenge.findByIdAndUpdate(challenge._id, {
                        $inc: { points: -5 }
                    });
                }
            }
        }

        // Hide expected outputs for visible test results (only show for failed tests)
        const visibleTestResults = testResult.testResults.map((tr, idx) => {
            const testCase = challenge.testCases[idx];
            return {
                testCaseIndex: tr.testCaseIndex,
                passed: tr.passed,
                input: !testCase.isHidden ? testCase.input : '[Hidden]',
                actualOutput: tr.actualOutput,
                expectedOutput: !testCase.isHidden ? tr.expectedOutput : '[Hidden]',
                executionTime: tr.executionTime,
                error: tr.error,
                isHidden: testCase.isHidden
            };
        });

        res.json({
            success: true,
            data: {
                submissionId: submission._id,
                status: testResult.status,
                compilationResult: testResult.compilationResult,
                testResults: visibleTestResults,
                passedTests: testResult.passedTests,
                totalTests: testResult.totalTests,
                score
            }
        });
    } catch (error) {
        console.error('Submit code error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
});

/**
 * @route   GET /api/challenges/:id/hint
 * @desc    Get hints for a challenge
 * @access  Authenticated
 */
router.get('/:id/hint', async (req, res) => {
    try {
        const hintIndex = parseInt(req.query.index) || 0;

        const challenge = await CodeChallenge.findById(req.params.id).select('hints');
        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: 'Challenge not found'
            });
        }

        if (hintIndex >= challenge.hints.length) {
            return res.status(400).json({
                success: false,
                message: 'No more hints available'
            });
        }

        res.json({
            success: true,
            data: {
                hint: challenge.hints[hintIndex],
                hintIndex,
                totalHints: challenge.hints.length
            }
        });
    } catch (error) {
        console.error('Get hint error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/challenges/user/progress
 * @desc    Get user's challenge progress and stats
 * @access  Authenticated
 */
router.get('/user/progress', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const totalChallenges = await CodeChallenge.countDocuments({
            programmingLanguage: user.selectedProgrammingLanguage
        });

        const acceptedSubmissions = await Submission.find({
            userId: user._id,
            status: 'accepted'
        }).distinct('challengeId');

        const totalSubmissions = await Submission.countDocuments({
            userId: user._id
        });

        res.json({
            success: true,
            data: {
                totalChallenges,
                completedChallenges: acceptedSubmissions.length,
                totalSubmissions,
                totalScore: user.totalScore,
                selectedLanguage: user.selectedProgrammingLanguage
            }
        });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   POST /api/challenges/finish
 * @desc    Finish quiz and update status
 * @access  Authenticated
 */
router.post('/finish', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            quizStarted: false
        });

        res.json({
            success: true,
            message: 'Quiz finished successfully'
        });
    } catch (error) {
        console.error('Finish quiz error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
