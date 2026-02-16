const mongoose = require('mongoose');
const User = require('./backend/models/User');
const dotenv = require('dotenv');

dotenv.config({ path: './backend/.env' });

const checkViolations = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({ role: 'USER' }); // Find all users
        console.log('--- USER VIOLATIONS REPORT ---');
        if (users.length === 0) {
            console.log('No users found.');
        }
        users.forEach(u => {
            console.log(`User: ${u.username} | Violations: ${u.violations} | Disqualified: ${u.isDisqualified}`);
        });
        console.log('------------------------------');

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkViolations();
