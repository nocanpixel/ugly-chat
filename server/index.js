import { db } from "./config/db-config.js";
import chalk from 'chalk';
import './associations.js'
import createApp from './config/server-config.js';
import { createServer } from 'node:http';

const port = process.env.PORT || 3000;

const { _ORIGIN_URL, WWW_ORIGIN_URL } = process.env;

const httpServer = createServer();

await createApp(httpServer,{
    cors: {
        origin: [_ORIGIN_URL,WWW_ORIGIN_URL],
        credentials: true,
    },
})


db.sync({ force: false });

// PORT LISTENER
httpServer.listen(port, ()=> {
    console.log(chalk.bgGreen(` Listening at ${port} `))
})