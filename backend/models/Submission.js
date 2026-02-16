const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
    testCaseIndex: {
        type: Number,
        required: true
    },
    passed: {
        type: Boolean,
        required: true
    },
    actualOutput: {
        type: String,
        default: ''
    },
    expectedOutput: {
        type: String,
        default: ''
    },
    executionTime: {
        type: Number,  // in ms
        default: 0
    },
    error: {
        type: String,
        default: null
    }
}, { _id: false });

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodeChallenge',
        required: true
    },
    submittedCode: {
        type: String,
        required: true
    },
    programmingLanguage: {
        type: String,
        required: true
    },
    compilationResult: {
        success: {
            type: Boolean,
            required: true
        },
        errors: {
            type: [String],
            default: []
        },
        output: {
            type: String,
            default: ''
        }
    },
    testResults: {
        type: [testResultSchema],
        default: []
    },
    passedTests: {
        type: Number,
        default: 0
    },
    totalTests: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['compilation_error', 'runtime_error', 'wrong_answer', 'accepted', 'partial'],
        required: true
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
submissionSchema.index({ userId: 1, challengeId: 1, createdAt: -1 });
submissionSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
