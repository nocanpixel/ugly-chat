import { db } from "./config/db-config.js";
import chalk from 'chalk';
import './associations.js'
import createApp from './config/server-config.js';
import { createServer } from 'node:http';


const port = process.env.PORT || 3000;


const httpServer = createServer();

await createApp(httpServer,{
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
})

db.sync({ force: false });

// PORT LISTENER
httpServer.listen(port, ()=> {
    console.log(chalk.bgGreen(` Listening at ${port} `))
})