import express, { json } from 'express';
import { db } from "./config/db-config.js";
const app = express();
import cookieParser from "cookie-parser";
import routes from "./routes/api.js";
import cors from "cors";
import { handle404 } from './middlewares/404.js';
import chalk from 'chalk';

const port = process.env.PORT || 3000;
const corsOptions = {
    origin: "http://localhost:5173",
    credentials:true,
    optionSuccessStatus: 200,
};

app.use(json())
app.use(cookieParser())
app.use(cors(corsOptions))
//Routes
app.use("/api", routes);

app.use(handle404);

db.sync().then(()=>{
    console.log(chalk.bgMagenta(` --Database synced-- `))
})

// PORT LISTENER
app.listen(port, ()=> {
    console.log(chalk.bgGreen(` Listening at ${port} `))
})