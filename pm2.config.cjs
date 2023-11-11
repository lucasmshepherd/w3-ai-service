module.exports = {
  apps: [
    {
      name: 'w3-ai-service',
      node_args: '-r dotenv/config',
      script: './server.js'
    }
  ]
};