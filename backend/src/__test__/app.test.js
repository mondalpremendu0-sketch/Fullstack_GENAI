const request = require('supertest');
const app = require('../app.js'); // Adjust the path to where your Express 'app' is exported

describe('Global 404 Fallback Handler', () => {
    
    it('should return 404 and the correct JSON message for undefined routes', async () => {
        // 1. Arrange & Act: Make a GET request to a route that definitely does not exist
        const response = await request(app).get('/api/some-random-missing-route-12345');

        // 2. Assert: Check that the status code is exactly 404
        expect(response.status).toBe(404);

        // 3. Assert: Check that the JSON response body matches your exact message
        expect(response.body).toEqual({ 
            message: "OOPS!! PAGE NOT FOUND" 
        });
    });

    it('should return 404 for undefined routes using other HTTP methods like POST', async () => {
        // Ensuring it also catches POST requests, not just GET
        const response = await request(app).post('/api/another-missing-route');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("OOPS!! PAGE NOT FOUND");
    });
});