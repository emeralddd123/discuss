const request = require("supertest")
const { connectDB, dropDB, dropCollections } = require('./testDb')
const app = require('../app');
const Discussion = require('../models/discussion')
const User = require('../models/user')

let userId

const createTestUser = async () => {
    const testUser1 = {
        username: 'testUser1', email: 'testUser1@gmail.com', password: 'password'
    }

    const newUser = await User(testUser1)
    await newUser.save()
    userId = newUser._id
}

const createTestDiscussions = async () => {
    const testDiscussions = [
        { heading: "Discussion 1", description: "Description 1", slug: "32467rt576hdgafsfdf", author: userId },
        { heading: "Discussion 2", description: "Description 2", slug: "324675734werthhdgafsfdf", author: userId },
        { heading: "Discussion 3", description: "Description 3", slug: "32467sdf576hdgafsfdf", author: userId },
        { heading: "Discussion 4", description: "Description 4", slug: "32467575676hdgafsfdf", author: userId },

    ];

    await Discussion.insertMany(testDiscussions);
};

beforeAll(async () => {
    await connectDB();
    await createTestUser()
    await createTestDiscussions()
});

afterAll(async () => {
    await dropDB();
});

// afterEach(async () => {
//     await dropCollections();
// });


let userToken
let discussionId

describe("User Authentication", () => {
    it("Should signup a user succesfully", async () => {
        let userData = {
            username: 'user1',
            email: 'user1@gmail.com',
            password: 'password'
        }

        const rawResponse = await request(app)
            .post('/api/users/signup')
            .send(userData)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(201)

            const response = JSON.parse(rawResponse.res.text)

        expect(response.message).toBe(`success`)
    })

    it("Should log in a user succesfully", async () => {
        let userDetails = {
            email: 'user1@gmail.com',
            password: 'password'
        }

        const rawResponse = await request(app)
            .post('/api/auth/login')
            .send(userDetails)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(201)
        const response = JSON.parse(rawResponse.res.text)
        // console.log(response)
        userToken = response.token
        expect(response.token).toBeDefined()
    })

})


describe("User Actions on the forum", () => {
    it("Should Fetch the discussions succesfully", async () => {

        const rawResponse = await request(app)
            .get('/api/discussion')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)


        const response = JSON.parse(rawResponse.res.text)

        expect(response.message).toBe('success')
        expect(response.data).toBeDefined()
        expect(response.data.discussions).toBeDefined()
    })

    it("Should Create A discussion Succesfully", async () => {
        let discData = {
            heading: "Join us on an Interstellar Journey!",
            description: "In this discussion, we'll delve into the mysteries of the cosmos and the cosmic adventure begin!"
        }
        const rawResponse = await request(app)
            .post('/api/discussion')
            .set("Authorization", `Bearer ${userToken}`)
            .send(discData)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(201)
        const response = JSON.parse(rawResponse.res.text)

        expect(response.discussion.heading).toBe(discData.heading)
        expect(response.discussion.description).toBe(discData.description)
        discussionId = response.discussion._id
        expect(response.discussion._id).toBeDefined()



    })


    // it("Should Fetch a Discussion By Id", async () => {
    //     const rawResponse = await request(app)
    //         .get(`/api/discussion/:${discussionId}`)
    //         .expect('Content-Type', 'application/json; charset=utf-8')
    //         // .expect(200)

    //     const response = JSON.parse(rawResponse.res.text)
    //     console.log(response)
    //     expect(response.message).toBe('success')
    //     expect(response.discussion).toBeDefined()
    // })


})