const mongoose = require('mongoose');
const UserService = require('./services/userService'); // Replace with the actual path
const connectToDb = require('./dbConnection')


const usersToSeed = [
    {
        username: 'moderator1',
        email: 'moderator1@gmail.com',
        password: 'password',
        role: 'moderator'
    },
    {
        username: 'moderator2',
        email: 'moderator2@gmail.com',
        password: 'password',
        role: 'moderator'
    },
    // Add more users as you wish
];



async function seedUsers() {
    await connectToDb()
    try {

        for (const userData of usersToSeed) {
            const response = await UserService.signup(userData);
            if (response.status === 201) {
                console.log(`User created successfully`);
            } else if( response.status === 409){
                console.log(`User with similar credentials already Existed`);
            } else {
                console.error(`Failed to create user: ${userData.username}`);
            }
        }

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        mongoose.disconnect();
    }
}

seedUsers();

