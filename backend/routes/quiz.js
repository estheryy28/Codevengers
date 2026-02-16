const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Question = require('../models/Question');
const AnswerLog = require('../models/AnswerLog');
const auth = require('../middleware/auth');

// All quiz routes require authentication
router.use(auth);

/**
 * @route   GET /api/quiz/languages
 * @desc    Get available programming languages
 * @access  Private
 */
router.get('/languages', async (req, res) => {
    try {
        const languages = await Question.distinct('programmingLanguage');
        res.json({
            success: true,
            data: { languages }
        });
    } catch (error) {
        console.error('Get languages error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   POST /api/quiz/select-language
 * @desc    Select programming language (locks after quiz starts)
 * @access  Private
 */
router.post('/select-language', async (req, res) => {
    try {
        const { language } = req.body;
        const userId = req.user._id;

        // Validate input
        if (!language) {
            return res.status(400).json({
                success: false,
                message: 'Programming language is required'
            });
        }

        // Get current user
        const user = await User.findById(userId);

        // Check if quiz already started - language is locked
        if (user.quizStarted && user.selectedProgrammingLanguage) {
            return res.status(400).json({
                success: false,
                message: 'Programming language is locked. Quiz has already started.'
            });
        }

        // Validate language exists in questions
        const languageExists = await Question.findOne({ programmingLanguage: language });
        if (!languageExists) {
            return res.status(400).json({
                success: false,
                message: 'Invalid programming language'
            });
        }

        // Update user's selected language
        user.selectedProgrammingLanguage = language;
        await user.save();

        res.json({
            success: true,
            message: 'Programming language selected successfully',
            data: {
                selectedLanguage: language
            }
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
 * @route   GET /api/quiz/questions
 * @desc    Get questions for selected language (excludes completed questions)
 * @access  Private
 */
router.get('/questions', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // Must have selected a language
        if (!user.selectedProgrammingLanguage) {
            return res.status(400).json({
                success: false,
                message: 'Please select a programming language first'
            });
        }

        // Mark quiz as started (locks language)
        if (!user.quizStarted) {
            user.quizStarted = true;
            await user.save();
        }

        // Get questions for selected language, excluding completed ones
        const questions = await Question.find({
            programmingLanguage: user.selectedProgrammingLanguage,
            _id: { $nin: user.completedQuestions }
        }).select('-correctAnswer'); // Don't send correct answer to client

        res.json({
            success: true,
            data: {
                questions,
                totalQuestions: await Question.countDocuments({
                    programmingLanguage: user.selectedProgrammingLanguage
                }),
                completedCount: user.completedQuestions.length,
                totalScore: user.totalScore
            }
        });
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/quiz/question/:id
 * @desc    Get a specific question (if not completed)
 * @access  Private
 */
router.get('/question/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid question ID'
            });
        }

        // Check if question is already completed
        if (user.completedQuestions.includes(id)) {
            return res.status(403).json({
                success: false,
                message: 'This question has already been completed. You cannot revisit it.'
            });
        }

        const question = await Question.findById(id).select('-correctAnswer');

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Verify question belongs to user's selected language
        if (question.programmingLanguage !== user.selectedProgrammingLanguage) {
            return res.status(403).json({
                success: false,
                message: 'Question does not belong to your selected programming language'
            });
        }

        res.json({
            success: true,
            data: { question }
        });
    } catch (error) {
        console.error('Get question error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   POST /api/quiz/submit
 * @desc    Submit an answer (scoring without transactions for standalone MongoDB)
 * @access  Private
 */
router.post('/submit', async (req, res) => {
    try {
        const { questionId, selectedAnswer } = req.body;
        const userId = req.user._id;

        // Validate input
        if (!questionId || !selectedAnswer) {
            return res.status(400).json({
                success: false,
                message: 'Question ID and selected answer are required'
            });
        }

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(questionId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid question ID'
            });
        }

        // Get user
        const user = await User.findById(userId);

        // Check if quiz has started
        if (!user.quizStarted) {
            return res.status(400).json({
                success: false,
                message: 'Please fetch questions first to start the quiz'
            });
        }

        // Check if question is already completed by this user
        if (user.completedQuestions.includes(questionId)) {
            return res.status(403).json({
                success: false,
                message: 'This question has already been completed. You cannot answer it again.'
            });
        }

        // Get question
        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Verify question belongs to user's selected language
        if (question.programmingLanguage !== user.selectedProgrammingLanguage) {
            return res.status(403).json({
                success: false,
                message: 'Question does not belong to your selected programming language'
            });
        }

        // Record scores before attempt
        const userScoreBefore = user.totalScore;
        const questionPointValue = question.currentPointValue;

        // Check if answer is correct
        const isCorrect = selectedAnswer === question.correctAnswer;

        let userScoreAfter = userScoreBefore;
        let pointsEarned = 0;

        if (isCorrect) {
            // Add points to user's score
            pointsEarned = questionPointValue;
            userScoreAfter = userScoreBefore + pointsEarned;
            user.totalScore = userScoreAfter;

            // Mark question as completed for this user
            user.completedQuestions.push(questionId);
            await user.save();

            // Reduce question's current point value by 5 (minimum 0)
            question.currentPointValue = Math.max(0, question.currentPointValue - 5);
            await question.save();
        }

        // Create answer log (always logged, correct or incorrect)
        const answerLog = new AnswerLog({
            userId,
            questionId,
            programmingLanguage: user.selectedProgrammingLanguage,
            selectedAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect,
            questionPointValueAtAttempt: questionPointValue,
            userScoreBefore,
            userScoreAfter,
            timestamp: new Date()
        });
        await answerLog.save();

        res.json({
            success: true,
            message: isCorrect ? 'Correct answer!' : 'Incorrect answer. Try again!',
            data: {
                isCorrect,
                pointsEarned,
                totalScore: userScoreAfter,
                questionCompleted: isCorrect,
                correctAnswer: isCorrect ? question.correctAnswer : undefined
            }
        });
    } catch (error) {
        console.error('Submit answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during answer submission'
        });
    }
});

/**
 * @route   GET /api/quiz/progress
 * @desc    Get user's quiz progress
 * @access  Private
 */
router.get('/progress', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user.selectedProgrammingLanguage) {
            return res.json({
                success: true,
                data: {
                    quizStarted: false,
                    selectedLanguage: null,
                    totalScore: 0,
                    completedCount: 0,
                    totalQuestions: 0
                }
            });
        }

        const totalQuestions = await Question.countDocuments({
            programmingLanguage: user.selectedProgrammingLanguage
        });

        res.json({
            success: true,
            data: {
                quizStarted: user.quizStarted,
                selectedLanguage: user.selectedProgrammingLanguage,
                totalScore: user.totalScore,
                completedCount: user.completedQuestions.length,
                totalQuestions
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

module.exports = router;
