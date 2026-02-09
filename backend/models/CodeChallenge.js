const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    input: {
        type: String,
        default: ''
    },
    expectedOutput: {
        type: String,
        required: true
    },
    isHidden: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const codeChallengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    programmingLanguage: {
        type: String,
        required: [true, 'Programming language is required'],
        enum: ['C', 'C++', 'Java', 'Python']
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: [true, 'Difficulty level is required']
    },
    buggyCode: {
        type: String,
        required: [true, 'Buggy code is required']
    },
    solutionCode: {
        type: String,
        required: [true, 'Solution code is required']
    },
    hints: {
        type: [String],
        default: []
    },
    testCases: {
        type: [testCaseSchema],
        required: true,
        validate: {
            validator: function (v) {
                return v.length >= 1;
            },
            message: 'At least one test case is required'
        }
    },
    timeLimit: {
        type: Number,
        default: 5000  // 5 seconds
    },
    memoryLimit: {
        type: Number,
        default: 256  // 256 MB
    },
    points: {
        type: Number,
        required: true,
        default: 100
    }
}, {
    timestamps: true
});

// Indexes
codeChallengeSchema.index({ programmingLanguage: 1, difficulty: 1 });

// Static method to get base points by difficulty
codeChallengeSchema.statics.getBasePoints = function (difficulty) {
    const points = {
        'easy': 100,
        'medium': 150,
        'hard': 200
    };
    return points[difficulty] || 100;
};

module.exports = mongoose.model('CodeChallenge', codeChallengeSchema);
