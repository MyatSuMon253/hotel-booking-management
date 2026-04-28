process.env.JWT_SECRET = "test-jwt-secret";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.STRIPE_SECRET_KEY = "sk_test_123";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_123";
process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
process.env.CLOUDINARY_API_KEY = "test-key";
process.env.CLOUDINARY_API_SECRET = "test-secret";
process.env.SMTP_HOST = "localhost";
process.env.SMTP_PORT = "1025";
process.env.SMTP_USERNAME = "user";
process.env.SMTP_PASSWORD = "password";
process.env.FROM_NAME = "Test Hotel";
process.env.FROM_EMAIL = "noreply@example.com";

beforeEach(() => {
  jest.resetAllMocks();
});
