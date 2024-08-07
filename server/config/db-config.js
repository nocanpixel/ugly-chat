import "mysql2";
import { Sequelize } from "sequelize";
const { PASSWORD, USER_DB, DB, HOST } = process.env;
import pino from "pino";
export const logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  })


export const db = new Sequelize(
    DB, USER_DB, PASSWORD, {
    host: HOST,
    dialect: 'mysql',
    logging: false,
    // dialectOptions: {
    //     ssl: {
    //         rejectUnauthorized: false,
    //     }
    // }
});


