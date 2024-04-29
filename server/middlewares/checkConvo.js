import { Sequelize } from "sequelize";
import Chats from "../models/Chats.js";
import Subscribers from "../models/Subscribers.js";
import Users from "../models/Users.js";

const checkConversation = async (req, res, next) => {
    try {
        const id = req.user.id;
        const { chatId } = req.params;
        
        const verifyUrl = await Chats.findOne({
            where: {
                id: chatId,
            }
        });
        
        if (!verifyUrl)return res.status(404).send('CHAT ID NOT FOUND!');

        const user = await Subscribers.findOne({
            where: {
                chat_id : chatId,
                user_id : {[Sequelize.Op.ne]:id}
            },
            attributes:[],
            include:[
                {
                    model:Users,
                    attributes:['username','is_online']
                }
            ]
        });

        req.user._openChat = {
            username:user.dataValues.User.dataValues.username,
            is_online:user.dataValues.User.dataValues.is_online,
        }


        next();
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

export default checkConversation;