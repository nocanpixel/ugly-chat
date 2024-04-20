import { UUID, UUIDV4 } from "sequelize";
import { db } from "../config/db-config.js";
import Users from "./Users.js";
import Friendship from "./Friendship.js";

const UserFriendship = db.define("UserFriendship", {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    friendship_id: {
        type: UUID,
        references: {
            model: Friendship,
            key: 'id'
        },
    },
    user_id: {
        type: UUID,
        references: {
            model: Users,
            key: 'id'
        },
    }
})

export default UserFriendship;