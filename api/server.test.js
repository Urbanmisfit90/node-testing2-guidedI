const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
});
beforeEach(async () => {
    await db.seed.run();
});

describe('[GET] /hobbits', () => {
    test('responds with 200 OK', async () => {
        const res = await request(server).get('/hobbits')
        expect(res.status).toBe(200)
    })
    test('responds with all the hobbits', async () => {
        const res = await request(server).get('/hobbits')
        expect(res.body).toHaveLength(4)
    })
})

describe('[POST] /hobbits', () => {
    const bilbo = { name: 'bilbo' }
    test('adds a hobbit to the database', async () => {
        await request(server).post('/hobbits').send(bilbo)
        const hobbits = await db('hobbits')
        expect(hobbits).toHaveLength(5)
    })
    test('responds with the new hobbit', async () => {
        const res = await request(server).post('/hobbits').send(bilbo)
        expect(res.status).toBe(201)
        expect(res.body).toMatchObject(bilbo)
        expect(res.body).toHaveProperty('id')
    })
})

describe('[DELETE] /hobbits/:id', () => {
    test('deletes the specified hobbit from the database', async () => {
        const res = await request(server).delete('/hobbits/1');
        expect(res.status).toBe(200); // Expecting status code 200 for successful deletion
        expect(res.body).toEqual({ message: "Hobbit deleted successfully" }); // Expecting the correct response message
        const hobbit = await db('hobbits').where({ id: 1 }).first();
        expect(hobbit).toBeUndefined(); // Expecting hobbit with ID 1 to be deleted
    });
});

describe('[PUT] /hobbits/:id', () => {
    const updatedHobbit = { name: 'Frodo' }; // Updated hobbit data
    test('updates the specified hobbit in the database', async () => {
        const res = await request(server).put('/hobbits/1').send(updatedHobbit);
        expect(res.status).toBe(200); // Expecting status code 200 for successful update
        expect(res.body).toMatchObject(updatedHobbit); // Expecting the updated hobbit data in the response
        const hobbit = await db('hobbits').where({ id: 1 }).first();
        expect(hobbit).toMatchObject(updatedHobbit); // Expecting the hobbit in the database to be updated
    });
});