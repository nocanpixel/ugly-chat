import Users from "./models/Users.js";
import Chats from "./models/Chats.js";
import Messages from "./models/Messages.js";
import Subscribers from "./models/Subscribers.js";
import Friendship from "./models/Friendship.js";
import UserFriendship from "./models/UserFriendship.js";

Users.hasMany(Messages, { foreignKey: "from_user" });
Messages.belongsTo(Users, { foreignKey: "from_user" });

Chats.hasMany(Messages, { foreignKey: "chat_id" });
Messages.belongsTo(Chats, { foreignKey: "chat_id" });

Users.belongsToMany(Chats, { through: Subscribers, foreignKey: "user_id" });
Chats.belongsToMany(Users, { through: Subscribers, foreignKey: "chat_id" });


Users.hasMany(Subscribers, { foreignKey: 'user_id' });
Subscribers.belongsTo(Users, { foreignKey: 'user_id' });

Messages.hasMany(Subscribers, {foreignKey: 'message_id'});
Subscribers.belongsTo(Messages, {foreignKey: 'message_id'});


//FRIENDS

Users.belongsToMany(Friendship, { through: UserFriendship, foreignKey: 'user_id' });
Friendship.belongsToMany(Users, { through: UserFriendship, foreignKey: 'friendship_id' });

Users.hasMany(UserFriendship, { foreignKey: 'user_id' });
UserFriendship.belongsTo(Users, { foreignKey: 'user_id' });

Friendship.hasMany(UserFriendship, {foreignKey:'friendship_id'});
UserFriendship.belongsTo(Friendship, {foreignKey:'friendship_id'});
