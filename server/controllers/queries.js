import { Sequelize } from "sequelize";
import { enumsFriends } from "./userController.js";

export class DB {
  constructor(Users, Friendship, UserFriendship) {
    this.Users = Users;
    this.Friendship = Friendship;
    this.UserFriendship = UserFriendship;
  }

  async setUserIsConnected(userId) {
    try {
      const response = await this.Users.update(
        { is_online: true },
        { where: { id: userId } }
      );
      return response;
    } catch (_) {
      ({ error: "Error connecting user" });
    }
  }

  async setUserIsDisconnected(userId) {
    try {
      const response = await this.Users.update(
        { is_online: false },
        { where: { id: userId } }
      );
      return response;
    } catch (_) {
      ({ error: "Error Disconnecting user" });
    }
  }

  async getFriends(userId) {

    try {
      const response = await this.UserFriendship.findAll({
        attributes: ["friendship_id"],
        where: {
          user_id: userId,
        },
        raw: true,
      });

      
      const myFriendshipId = response.map((friends) => friends.friendship_id);
      
      
      const friends = await this.UserFriendship.findAll({
        where: {
          friendship_id: { [Sequelize.Op.in]: myFriendshipId },
          user_id: { [Sequelize.Op.ne]: userId },
        },
        attributes: [],
        include: [
          {
            model: this.Friendship,
            where: { status: enumsFriends.accepted },
          },
          {
            model: this.Users,
            attributes: ["id"],
          },
        ],
      });
      
      return friends.map((friend) => (friend.User.dataValues.id));
    } catch (_) {
      ({ error: "Couldn't find frents" });
    }
  }
}
