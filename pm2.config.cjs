module.exports = {
  apps: [
    {
      name: 'rayn-ai-service',
      node_args: '-r dotenv/config',
      script: './server.js'
    }
  ]
};