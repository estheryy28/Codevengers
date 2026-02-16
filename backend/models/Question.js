const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    programmingLanguage: {
        type: String,
        required: [true, 'Programming language is required'],
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: [true, 'Difficulty level is required']
    },
    questionText: {
        type: String,
        required: [true, 'Question text is required']
    },
    options: {
        type: [String],
        required: [true, 'Options are required'],
        validate: {
            validator: function (v) {
                return v.length === 4;
            },
            message: 'Question must have exactly 4 options'
        }
    },
    correctAnswer: {
        type: String,
        required: [true, 'Correct answer is required']
    },
    currentPointValue: {
        type: Number,
        required: true
    },
    basePointValue: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Index for efficient querying by language
questionSchema.index({ programmingLanguage: 1, difficulty: 1 });

// Static method to get base points by difficulty
questionSchema.statics.getBasePoints = function (difficulty) {
    const points = {
        'easy': 100,
        'medium': 150,
        'hard': 200
    };
    return points[difficulty] || 100;
};

module.exports = mongoose.model('Question', questionSchema);
