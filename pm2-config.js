module.exports = {
    apps: [
        {
            name: 'backend',
            script: 'ts-node',
            args: './src/index.ts',
            watch: false, // Disable watch to prevent file-change restarts
            ignore_watch: ['node_modules', 'logs', '*.log'],
            instances: 1,
            exec_mode: 'fork',
            autorestart: true,
            max_restarts: 10,
            min_uptime: '10s', // Wait 10s before considering it stable
            max_memory_restart: '1G', // Only restart if memory exceeds 1GB
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
        },
    ],
};
