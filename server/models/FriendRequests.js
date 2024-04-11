import { ENUM, UUID, UUIDV4 } from "sequelize";
import { db } from "../config/db-config.js";
import Users from "./Users.js";

const FriendRequests = db.define("Friend_requests", {
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
        },
    },
    to_user: {
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

export default FriendRequests;