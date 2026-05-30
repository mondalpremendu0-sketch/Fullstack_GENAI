const request = require("supertest");
const app = require('../app.js');
const db = require("./setup/db.js"); // Import our new RAM database helpers

// --- JEST LIFECYCLE HOOKS ---
// Start the RAM database before any tests run
beforeAll(async () => {
    await db.connect();
});

// Wipe the database completely clean after every single test
afterEach(async () => {
    await db.clearDatabase();
});

// Shut the database down when all tests are finished
afterAll(async () => {
    await db.closeDatabase();
});
// ----------------------------

describe("Auth API Endpoints", () => {
    describe("POST /api/auth/register", () => {
        it("should successfully create a new user in the RAM database", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "newuser@example.com",
                    password: "securepassword123",
                    firstname: "Test",
                    lastname:"User"
                });
            // The user should be created successfully
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("message");

            // Because we use HttpOnly cookies, we should check if the server sent one!
            expect(response.headers["set-cookie"]).toBeDefined();
        });

        it("should fail if we try to register the exact same email twice", async () => {
            const userData = {
                email: "duplicate@example.com",
                password: "password123",
                name: "Duplicate User"
            };

            // 1. Create the user the first time
            await request(app).post("/api/auth/register").send(userData);

            // 2. Try to create them again
            const response = await request(app)
                .post("/api/auth/register")
                .send(userData);

            // It should fail with a 400 Bad Request
            expect(response.status).toBe(401);
        });
    });

    describe("POST /api/auth/login", () => {
        it("should reject invalid credentials", async () => {
            const response = await request(app).post("/api/auth/login").send({
                email: "doesntexist@example.com",
                password: "wrongpassword"
            });

            expect(response.status).toBe(401);
            
        });
    });
});
