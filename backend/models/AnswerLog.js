const mongoose = require('mongoose');

const answerLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    programmingLanguage: {
        type: String,
        required: true
    },
    selectedAnswer: {
        type: String,
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    questionPointValueAtAttempt: {
        type: Number,
        required: true
    },
    userScoreBefore: {
        type: Number,
        required: true
    },
    userScoreAfter: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
answerLogSchema.index({ userId: 1, timestamp: -1 });
answerLogSchema.index({ questionId: 1 });
answerLogSchema.index({ userId: 1, questionId: 1 });

module.exports = mongoose.model('AnswerLog', answerLogSchema);
