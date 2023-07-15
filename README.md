To run the server, you need to use the `npm run dev` command. It is configured to preload the .env variable for the app.
If you for some reason to call it directly, call it like this to preload the .env `node -r dotenv/config server.js`.
The same is true if you launch it from a process manager. A PM2 configuration file has been included so it is ready to go.
Don't forget to setup your actual .env file. The .env.example shows you the necessary variables it should contain.