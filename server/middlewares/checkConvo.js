import Chats from "../models/Chats.js";

const checkConversation = async (req, res, next) => {
    const { chatId } = req.params;
    try {
        const verifyUrl = await Chats.findOne({
            where: {
                id: chatId,
            }
        });

        if (!verifyUrl)return res.status(404).send('CHAT ID NOT FOUND!');

        next();
    } catch (error) {
        console.error("Error in checkConversation middleware:", error);
        res.status(500).send("Internal Server Error");
    }
};

export default checkConversation;