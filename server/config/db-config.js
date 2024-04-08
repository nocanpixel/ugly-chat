import "mysql2";
import { Sequelize } from "sequelize";

const {PASSWORD, USER_DB, DB} = process.env;

export const db = new Sequelize(
    DB, USER_DB, PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    // dialectOptions: {
    //     ssl: {
    //         rejectUnauthorized: false,
    //     }
    // }
});