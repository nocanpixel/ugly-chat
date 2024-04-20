import { ENUM, UUID, UUIDV4 } from "sequelize";
import { db } from "../config/db-config.js";
import Users from "./Users.js";

const Friendship = db.define("Friendship", {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    user_1: {
        type: UUID,
        references: {
            model: Users,
            key: 'id'
        },
    },
    user_2: {
        type: UUID,
        references: {
            model: Users,
            key: 'id'
        },
    },
    status: {
        type: ENUM("accepted","pending","rejected"),
        defaultValue: "pending",
    }
})

export default Friendship;