const { connectDB, dropDB, dropCollections } = require('./testDb')

const User = require('../models/user');
const DiscService = require('../services/discussionService')
const authService = require('../services/authService')
const userService = require('../services/userService')


beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await dropDB();
});

// afterEach(async () => {
//     await dropCollections();
// });

let userId
let jwtToken

let user2Id
let user2token

describe("User Model", () => {
    it("should create a user succesfully", async () => {
        let validUser = {
            username: 'user1',
            email: 'user1@gmail.com',
            password: 'password'
        }

        const newUser = await User(validUser)
        await newUser.save()
        userId = newUser._id
        expect(newUser._id).toBeDefined()
        expect(newUser.username).toBe(validUser.username);
        expect(newUser.email).toBe(validUser.email);
    })

    it("Should log in a user succesfully", async () => {
        let userDetails = {
            email: 'user1@gmail.com',
            password: 'password'
        }

        const response = await authService.login(userDetails)
        jwtToken = response.token
        expect(response.status).toBe(201)
        expect(response.message).toBe('Success')
        expect(response.token).toBeDefined()
    })

    it("Should Create User2 account succesfully", async () => {
        let userData = {
            email: 'user2@gmail.com',
            username: 'user2',
            password: 'password'
        }
        const response = await userService.signup(userData)
        user2token = response.token
        expect(response.status).toBe(201)
        expect(response.message).toBe('success')
        expect(response.token).toBeDefined()
    })
})

describe("Discussion Testing", () => {
    it("should create a discussion successfully", async () => {
        let validDisc = {
            heading: "Heading for discussion 1",
            description: "some description here andie",
        };
        const response = await DiscService.createDiscussion(userId, validDisc);
        const newDisc = response.discussion
        expect(newDisc._id).toBeDefined();
        expect(newDisc.heading).toBe(validDisc.heading);
        expect(newDisc.description).toBe(validDisc.description);
    });


    it("should create another discussion successfully", async () => {
        let validDisc = {
            heading: "Heading for discussion 2",
            description: "Discussion 2 description kfgiudfg ",
        };
        const response = await DiscService.createDiscussion(userId, validDisc);
        const newDisc = response.discussion
        expect(newDisc._id).toBeDefined();
        expect(newDisc.heading).toBe(validDisc.heading);
        expect(newDisc.description).toBe(validDisc.description);
    });


});