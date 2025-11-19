import { createServer } from "./infrastructure/config/app";
import { schoolConnectDB } from "./infrastructure/config/connectDb";
import dotenv from 'dotenv'
dotenv.config()

// Global error handlers to prevent server crashes
process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Log but don't exit - let the server continue running
});

process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    console.error('Stack:', error.stack);
    // For uncaught exceptions, we should exit but let PM2 restart it
    process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

const startServer = async () => {
    try {
        // Establish database connection once at startup
        await schoolConnectDB();
        console.log('Database connection established');
        
        const app = createServer()
        if (!app) {
            throw new Error('Failed to create server');
        }
        
        const PORT = process.env.PORT || 3000;
        
        app.listen(PORT, () => {
            console.log(`Server connected and listening on port ${PORT}`);
        }).on('error', (error: NodeJS.ErrnoException) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Please use a different port.`);
            } else {
                console.error('Server error:', error);
            }
            process.exit(1);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }  
}
startServer()