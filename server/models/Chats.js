import { UUID, UUIDV4 } from "sequelize";
import { db } from "../config/db-config.js";
import { v4 as uuidv4 } from "uuid";


const Chats = db.define("Chats", {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
})

export default Chats;