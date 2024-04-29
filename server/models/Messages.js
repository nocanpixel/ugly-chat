import { BOOLEAN, ENUM, INTEGER, TEXT, UUID, UUIDV4 } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import Users from "./Users.js";
import Chats from "./Chats.js";
import { db } from "../config/db-config.js";

const Messages = db.define("Messages", {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    from_user: {
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
    context: {
        type: TEXT,
        allowNull: false,
    },
    message_offset: {
        type: BOOLEAN,
        allowNull: false,
    },
    seen: {
        type: BOOLEAN,
        allowNull: false,
    }
})


export default Messages;