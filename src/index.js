require('dotenv').config(); // Load environment variables at the top
const app = require('./app');

// Set the port from environment or fallback to 3000
const PORT = process.env.PORT || 3000;

// Start the server
const server = app.listen(PORT, () => {
    console.info(`🚀 Server is running on port ${PORT}`);
});

// Graceful shutdown handler
const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.info('Server closed');
            process.exit(1); // Exit process with a failure code
        });
    } else {
        process.exit(1); // Exit process with a failure code
    }
};

// Handle unexpected errors
const unexpectedErrorHandler = (error) => {
    console.error('🔥 Unexpected Error:', error);
    exitHandler();
};

// Handle uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

// Handle SIGTERM (e.g., from Docker, Kubernetes, or OS)
process.on('SIGTERM', () => {
    console.info('🛑 SIGTERM received. Shutting down gracefully...');
    if (server) {
        server.close(() => {
            console.info('Server closed due to SIGTERM');
        });
    }
});
