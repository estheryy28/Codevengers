const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const CodeChallenge = require('./models/CodeChallenge');

// Load env vars
dotenv.config();

const fixUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quiz_system');
        console.log('Connected to MongoDB');

        const users = await User.find({ role: 'USER' });

        for (const user of users) {
            if (!user.selectedProgrammingLanguage) continue;

            const totalChallenges = await CodeChallenge.countDocuments({
                programmingLanguage: user.selectedProgrammingLanguage
            });

            console.log(`Checking user: ${user.username} | Completed: ${user.completedQuestions.length} / ${totalChallenges} | Started: ${user.quizStarted}`);

            if (user.completedQuestions.length >= totalChallenges && user.quizStarted) {
                console.log(`-> FIXING: Marking ${user.username} as COMPLETED (quizStarted = false)`);
                user.quizStarted = false;
                await user.save();
            }
        }

        console.log('Done!');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixUsers();
