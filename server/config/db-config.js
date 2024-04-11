import "mysql2";
import { Sequelize } from "sequelize";
const { PASSWORD, USER_DB, DB } = process.env;
import pino from "pino";
const logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  })


export const db = new Sequelize(
    DB, USER_DB, PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: sql => logger.info(sql),
    // dialectOptions: {
    //     ssl: {
    //         rejectUnauthorized: false,
    //     }
    // }
});


