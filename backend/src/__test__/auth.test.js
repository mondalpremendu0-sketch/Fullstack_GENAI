const request = require("supertest");
const app = require("../app.js");
const jwt = require('jsonwebtoken');
const db = require("./setup/db.js"); // Import our new RAM database helpers
const UserModel = require("../model/auth.model.js"); // Ensure this path is correct!
const blackListModel = require('../model/blacklist.model.js')
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
      it('should return 401 if any required field is missing', async () => {
    const response = await request(app)
        .post('/api/auth/register') // (Change to /login if this is your login controller!)
        .send({
            // We are intentionally leaving out firstname and lastname!
            email: "incomplete@example.com",
            password: "password123"
        });

    expect(response.status).toBe(401);
    // This MUST exactly match the string in your AppError
    expect(response.body.message).toBe("All fields are required"); 
});
      
        it("should successfully create a new user in the RAM database", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "newuser@example.com",
                    password: "securepassword123",
                    firstname: "Test",
                    lastname: "User"
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
                firstname: "Duplicate",
                lastname: "user"
            };

            // 1. Create the user the first time
            await request(app).post("/api/auth/register").send(userData);

            // 2. Try to create them again
            const response = await request(app)
                .post("/api/auth/register")
                .send(userData);

            // It should fail with a 400 Bad Request
            expect(response.status).toBe(400);
        });

        it("should return 400 if the user already exists", async () => {
            // 1. Create a fake user
            const duplicateUser = {
                firstname: "Clone",
                lastname: "Trooper",
                email: "clone@example.com",
                password: "password123"
            };

            // 2. Register the user the first time (This will succeed)
            await request(app).post("/api/auth/register").send(duplicateUser);

            // 3. Try to register the exact same user a second time!
            const response = await request(app)
                .post("/api/auth/register")
                .send(duplicateUser);
            // 4. Assert that your AppError correctly blocked them
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("User already Exists"); // Must match your code exactly!
        });

        it("should return 401 if the database fails to return the created user", async () => {
            // 1. HIJACK THE DATABASE: Force UserModel.create() to return null
            const dbFailMock = jest
                .spyOn(UserModel, "create")
                .mockResolvedValue(null);

            // 2. Send a perfectly valid registration request
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    firstname: "Unlucky",
                    lastname: "User",
                    email: "unlucky@example.com",
                    password: "password123"
                });

            // 3. Assert that your AppError caught the anomaly
            expect(response.status).toBe(401);

            // NOTE: We must match your exact string, including the missing "be"!
            expect(response.body.message).toBe("User could not created");

            // 4. CRITICAL: Clean up the hijack so the next tests don't break!
            dbFailMock.mockRestore();
        });

        it("should trigger the catch block and return 500 if an unexpected server crash occurs", async () => {
            // 1. THE HIJACK: Force the database to violently crash!
            // Notice we use .mockRejectedValue() instead of .mockResolvedValue()
            const fatalErrorMock = jest
                .spyOn(UserModel, "create")
                .mockRejectedValue(new Error("Catastrophic Server Meltdown!"));

            // 2. Send a perfectly valid request
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    firstname: "Doomed",
                    lastname: "User",
                    email: "doomed@example.com",
                    password: "password123"
                });

            // 3. Assert that your controller safely caught the error and returned a 500 status
            expect(response.status).toBe(500);

            // Your AppError passes the err.message directly to the user, so we test for it here:
            expect(response.body.message).toBe("Catastrophic Server Meltdown!");

            // 4. CRITICAL: Clean up the hijack!
            fatalErrorMock.mockRestore();
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

        it("should return 401 if email or password is missing", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                // Notice we intentionally only send the email, no password!
                .send({ email: "missing@example.com" });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("All fields are required");
        });

        it('should return 400 if the user registered via Google (no password)', async () => {
    // 1. THE HIJACK: Mock the Mongoose chain! findOne().select()
    const googleUserMock = jest.spyOn(UserModel, 'findOne').mockReturnValue({
        select: jest.fn().mockResolvedValue({
            email: 'google@example.com',
            firstName: 'Google',
            lastName: 'User'
            // Intentionally omitting the password property!
        })
    });

    const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'google@example.com', password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("This account was created with Google. Please click 'Continue with Google' to log in.");

    // 2. Clean up the hijack!
    googleUserMock.mockRestore();
});
    
        it("should return 400 if the password does not match", async () => {
            // 1. Create a valid user in the test database
            await request(app).post("/api/auth/register").send({
                firstname: "Valid",
                lastname: "User",
                email: "valid@example.com",
                password: "correctpassword123"
            });
        
            // 2. Try to log in with the wrong password
            const response = await request(app).post("/api/auth/login").send({
                email: "valid@example.com",
                password: "WRONGpassword123"
            });
        
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid Password");
        });
      
        it('should trigger the catch block and return 500 if the database crashes during login', async () => {
    // 1. THE HIJACK: Force the chain to crash!
    const fatalErrorMock = jest.spyOn(UserModel, 'findOne').mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error("Login Database Crash!"))
    });

    const response = await request(app)
        .post('/api/auth/login')
        .send({
            email: "crash@example.com",
            password: "password123"
        });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Login Database Crash!");

    // 2. Clean up the hijack!
    fatalErrorMock.mockRestore();
});

    });
    
    describe('GET /api/auth/getMe (User Profile)', () => {

    let authCookie;

    beforeAll(async () => {
        // 1. Generate a completely unique email every time this runs!
        const uniqueEmail = `tester_${Date.now()}@example.com`;

        // 2. Register the unique user
        await request(app).post('/api/auth/register').send({
            firstname: "Bulletproof",
            lastname: "Tester",
            email: uniqueEmail, // Use the dynamic email here
            password: "password123"
        });

        // 3. Log them in
        const loginRes = await request(app).post('/api/auth/login').send({
            email: uniqueEmail, // And use it here!
            password: "password123"
        });

        // 4. Safely grab the cookie
        authCookie = loginRes.headers['set-cookie'];
        
    });

    // 1. THE HAPPY PATH
    it('should return 200 and the user data if successful', async () => {
        // 1. THE HIJACK: We mock the DB so we don't need a real user in the test DB!
        const happyMock = jest.spyOn(UserModel, 'findById').mockReturnValue({
            select: jest.fn().mockResolvedValue({
                firstname: "John",
                lastname: "Doe",
                email: "john@example.com"
            })
        });

        const response = await request(app)
            .get('/api/auth/getMe') // Adjust this URL if your route is different!
            .set('Cookie', authCookie);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("data fetched successfully");
        expect(response.body.user.firstname).toBe("John");

        happyMock.mockRestore();
    });

    // 2. THE GHOST USER PATH (Database returns null)
    it('should return 401 if the user no longer exists in the database', async () => {
        // THE HIJACK: Mongoose chaining to return null
        const ghostMock = jest.spyOn(UserModel, 'findById').mockReturnValue({
            select: jest.fn().mockResolvedValue(null)
        });

        const response = await request(app)
            .get('/api/auth/getMe')
            .set('Cookie', authCookie);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("User not found"); // Must match line 16!

        ghostMock.mockRestore();
    });

    // 3. THE CORRUPT TOKEN PATH (Missing req.user.id)
    it('should return 401 if the JWT token is missing the user ID', async () => {
        // THE HIJACK: We trick jsonwebtoken into returning an empty payload!
        // This allows it to pass your middleware, but fail at line 7 of your controller.
        const jwtMock = jest.spyOn(jwt, 'verify').mockReturnValue({}); 

        const response = await request(app)
            .get('/api/auth/getMe')
            .set('Cookie', authCookie);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("User not found"); // Must match line 8!

        jwtMock.mockRestore();
    });

    // 4. THE MISSING REQ.USER PATH 
    // Note: This tests line 2 of your controller. 
    // If your isLogedIn middleware already blocks missing cookies, this test will 
    // actually just prove your middleware works!
    it('should return 400 (or block via middleware) if req.user is undefined', async () => {
        const response = await request(app)
            .get('/api/auth/getMe'); // Intentionally sending NO cookie

        // Depending on how strict your isLogedIn middleware is, 
        // this might return a 401 from the middleware, or your 400 from the controller.
        // Adjust the expected status to match whichever one fires first!
        expect([400, 401]).toContain(response.status); 
    });
    
    it('should trigger the catch block and return 500 if the database crashes while fetching the profile', async () => {
    // 1. THE HIJACK: Force the chained Mongoose query to violently crash
    const fatalErrorMock = jest.spyOn(UserModel, 'findById').mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error("Profile DB Crash!"))
    });

    // 2. Make the request using the valid authCookie
    const response = await request(app)
        .get('/api/auth/getMe')
        .set('Cookie', authCookie);

    // 3. Assert that your error handler caught the crash
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Profile DB Crash!");

    // 4. CRITICAL: Clean up the hijack!
    fatalErrorMock.mockRestore();
});
    
    
});
    
    describe('GET /api/auth/logout', () => {

      let authCookie;

    beforeAll(async () => {
        // 1. Generate a completely unique email every time this runs!
        const uniqueEmail = `tester_${Date.now()}@example.com`;

        // 2. Register the unique user
        await request(app).post('/api/auth/register').send({
            firstname: "Bulletproof",
            lastname: "Tester",
            email: uniqueEmail, // Use the dynamic email here
            password: "password123"
        });

        // 3. Log them in
        const loginRes = await request(app).post('/api/auth/login').send({
            email: uniqueEmail, // And use it here!
            password: "password123"
        });

        // 4. Safely grab the cookie
        authCookie = loginRes.headers['set-cookie'];
        
        // Optional: If you want to prove to yourself this is working, uncomment the next line:
        // console.log("Did we get the cookie?", authCookie ? "YES!" : "NOPE!");
    });
    
    // 1. HAPPY PATH: User logs out WITH a token
    it('should blacklist the token, clear the cookie, and return 200', async () => {
        const createMock = jest.spyOn(blackListModel, 'create').mockResolvedValue({});

        const response = await request(app)
            .get('/api/auth/logout') 
            // CHANGE THIS LINE: Use the real cookie!
            .set('Cookie', authCookie); 

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("logout Successfully");

        // Assert that the controller told the browser to clear the cookie!
        // Express sends a 'set-cookie' header with an empty string and an expired date to delete it.
        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toMatch(/token=;/); 

        createMock.mockRestore();
    });

    // 2. BRANCH COVERAGE: User logs out WITHOUT a token
    // 2. BRANCH COVERAGE: User tries to log out WITHOUT a token
    it('should be blocked by middleware and return 401 if no token was provided', async () => {
        const createMock = jest.spyOn(blackListModel, 'create');

        const response = await request(app)
            .get('/api/auth/logout'); // No cookie!

        // The middleware blocks it, so we expect 401 Unauthorised!
        expect(response.status).toBe(401);
        
        // Assert the database was skipped
        expect(createMock).not.toHaveBeenCalled();

        createMock.mockRestore();
    });

    // 3. THE CATCH BLOCK (The Server Disaster)
    it('should trigger the catch block and return 500 if the database crashes during logout', async () => {
        const fatalErrorMock = jest.spyOn(blackListModel, 'create').mockRejectedValue(new Error("Blacklist DB Crash!"));

        const response = await request(app)
            .get('/api/auth/logout')
            .set('Cookie', authCookie); 

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Blacklist DB Crash!");

        fatalErrorMock.mockRestore();
    });
});
    
    
});
