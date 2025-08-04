module.exports = {
  apps: [
    {
      name: 'sic-backend', // The name of the app you want
      script: 'dist/main.js', // Main executable file (after build)
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
