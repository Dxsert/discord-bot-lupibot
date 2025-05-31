module.exports = {
    apps: [
      {
        name: "LupiBot-LIVE",
        script: "index.js",
        watch: true,
        env: {
          NODE_ENV: "development",
          TOKEN: process.env.TOKEN,
          RESTART_CHANNEL_ID: process.env.RESTART_CHANNEL_ID
        },
        env_production: {
          NODE_ENV: "production"
        }
      }
    ]
  };
  