const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        if (username.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Username must be at least 3 characters'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username: username.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }

        // Create new user (role defaults to USER)
        const user = new User({
            username: username.toLowerCase(),
            password,
            role: 'USER'
        });

        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT
 * @access  Public
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

<<<<<<< HEAD
        // Check if user is disqualified
        if (user.isDisqualified) {
            return res.status(403).json({
                success: false,
                message: 'You have been disqualified for multiple cheating attempts.'
            });
        }

=======
>>>>>>> 2ad77c6470fc98a9002d3cc2e22bc860cab2a578
        // Check if user has already completed the quiz
        // Logic: If role is USER, quizStarted is false, AND they have completed questions (> 0)
        // This implies they finished the quiz loop.
        if (user.role === 'USER' && !user.quizStarted && user.completedQuestions && user.completedQuestions.length > 0) {
            return res.status(403).json({
                success: false,
                message: 'You have already completed the quiz. Access is restricted.'
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    selectedProgrammingLanguage: user.selectedProgrammingLanguage,
                    totalScore: user.totalScore,
                    completedQuestions: user.completedQuestions.length,
<<<<<<< HEAD
                    quizStarted: user.quizStarted,
                    violations: user.violations,
                    isDisqualified: user.isDisqualified
=======
                    quizStarted: user.quizStarted
>>>>>>> 2ad77c6470fc98a9002d3cc2e22bc860cab2a578
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    selectedProgrammingLanguage: user.selectedProgrammingLanguage,
                    totalScore: user.totalScore,
                    completedQuestions: user.completedQuestions.length,
<<<<<<< HEAD
                    quizStarted: user.quizStarted,
                    violations: user.violations,
                    isDisqualified: user.isDisqualified
=======
                    quizStarted: user.quizStarted
>>>>>>> 2ad77c6470fc98a9002d3cc2e22bc860cab2a578
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

<<<<<<< HEAD
/**
 * @route   POST /api/auth/violation
 * @desc    Record a cheating violation
 * @access  Private
 */
router.post('/violation', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(__dirname, '../violation_debug.log');

        const oldViolations = user.violations;
        user.violations = (user.violations || 0) + 1;

        fs.appendFileSync(logPath, `[${new Date().toISOString()}] User ${user.username} (${user._id}) - Violations: ${oldViolations} -> ${user.violations}\n`);
        console.log(`[VIOLATION] User ${user.username} (${user._id}) - Violations: ${oldViolations} -> ${user.violations}`);

        if (user.violations >= 3) {
            user.isDisqualified = true;
            fs.appendFileSync(logPath, `[${new Date().toISOString()}] User ${user.username} DISQUALIFIED\n`);
        }

        await user.save();
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] SAVE SUCCESS\n`);

        res.json({
            success: true,
            data: {
                violations: user.violations,
                isDisqualified: user.isDisqualified
            }
        });
    } catch (error) {
        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(__dirname, '../violation_debug.log');
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] ERROR: ${error.message}\n`);

        console.error('Violation recording error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

=======
>>>>>>> 2ad77c6470fc98a9002d3cc2e22bc860cab2a578
module.exports = router;
