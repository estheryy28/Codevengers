/**
 * Clear Database Script
 * Removes all data from CodeChallenges, Submissions, and resets user progress
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function clearDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear all collections
        const db = mongoose.connection.db;

        console.log('\nClearing collections...');

        // Clear CodeChallenges
        const challengeResult = await db.collection('codechallenges').deleteMany({});
        console.log(`  - CodeChallenges: ${challengeResult.deletedCount} deleted`);

        // Clear Submissions
        const submissionResult = await db.collection('submissions').deleteMany({});
        console.log(`  - Submissions: ${submissionResult.deletedCount} deleted`);

        // Clear old Questions (MCQ) if exists
        try {
            const questionResult = await db.collection('questions').deleteMany({});
            console.log(`  - Questions (old MCQ): ${questionResult.deletedCount} deleted`);
        } catch (e) {
            // Collection might not exist
        }

        // Clear old AnswerLogs if exists
        try {
            const answerResult = await db.collection('answerlogs').deleteMany({});
            console.log(`  - AnswerLogs (old): ${answerResult.deletedCount} deleted`);
        } catch (e) {
            // Collection might not exist
        }

        // Reset user progress (optional - keeps users but clears their scores)
        const userResult = await db.collection('users').updateMany(
            {},
            {
                $set: {
                    totalScore: 0,
                    completedQuestions: [],
                    quizStarted: false,
                    selectedProgrammingLanguage: null
                }
            }
        );
        console.log(`  - Users reset: ${userResult.modifiedCount} users`);

        console.log('\n✅ Database cleared successfully!');
        console.log('Ready for new challenges.\n');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

clearDatabase();
