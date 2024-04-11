import { BOOLEAN, STRING, UUID, UUIDV4 } from "sequelize";
import { db } from "../config/db-config.js";



const Users = db.define("Users", {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,

    },
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
    is_online: {
        type: BOOLEAN,
        defaultValue:false,
        allowNull: false,
    }
});

export default Users;