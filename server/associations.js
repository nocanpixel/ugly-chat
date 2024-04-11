import Users from "./models/Users.js";
import Chats from "./models/Chats.js";
import Messages from "./models/Messages.js";
import Subscribers from "./models/Subscribers.js";
import FriendRequests from "./models/FriendRequests.js";


//User has many messages

Users.hasMany(Messages,{foreignKey:"from_user"});
Messages.belongsTo(Users,{foreignKey:"from_user"})


//Chat has many messages

Chats.hasMany(Messages,{foreignKey:"chat_id"});
Messages.belongsTo(Chats,{foreignKey:"chat_id"});

Users.belongsToMany(Chats, {through: Subscribers,foreignKey:"user_id"});
Chats.belongsToMany(Users, {through: Subscribers,foreignKey:"chat_id"})



Users.hasMany(FriendRequests, { foreignKey: 'from_user', as: 'sent_requests' });
Users.hasMany(FriendRequests, { foreignKey: 'to_user', as: 'received_requests' });