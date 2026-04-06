// Set default environment variables for all test suites
process.env.DATABASE_URL = 'mysql://mock:mock@localhost:3306/mockdb';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '7d';
process.env.PORT = '5000';
process.env.NODE_ENV = 'test';
