module.exports = {
  apps : [{
    name: 'mercado-mutant',
    script: './build/server.js',
    instances: "max",
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
