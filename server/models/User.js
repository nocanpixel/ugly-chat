import { STRING } from "sequelize";
import { db } from "../config/db-config.js";



const User = db.define("User", {
    username: {
        type: STRING,
        unique: true,
        allowNull: false,
    },
    email: {
        type: STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: STRING,
        allowNull: false,
    },
    // phone: {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    //     unique:true,
    // }
});

export default User;