import { INTEGER, UUID, UUIDV4 } from "sequelize";
import Users from "./Users.js";
import Chats from "./Chats.js";
import Messages from "./Messages.js";
import { db } from "../config/db-config.js";
import { v4 as uuidv4 } from "uuid";

const Subscribers = db.define("Subscribers", {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,

    },
    user_id: {
        type: UUID,
        references: {
            model: Users,
            key: 'id'
        }
    },
    chat_id: {
        type: UUID,
        references: {
            model: Chats,
            key: 'id'
        }
    },
    message_id: {
        type: UUID,
        references: {
            model: Messages,
            key: 'id'
        }
    }
})


export default Subscribers;