import Ajv from "ajv";
import addFormats from "ajv-formats";
import { userRoom } from "../utils.js";


const ajv = new Ajv({
    useDefaults: true,
});

addFormats(ajv);

const validate = ajv.compile({
    type: "object",
    properties: {
        context: { type: "string", minLength: 1, maxLength: 5000 },
        chat_id: { type: "string", format: "uuid" },
    },
    required: ["context", "chat_id"],
    additionalProperties: false,
})

export function emitMessage({socket,sqldb}){
    return async(payload, callback) => {
        const checkPayload = validate(payload);

        if(!checkPayload){
            return callback({
                status: "ERROR",
                errors: validate.errors,
            })
        }

        let message;
        const userId = socket.userId;

        try{
            message = await sqldb.sendMessage(socket,payload.chat_id,payload.context);
        }catch(_){
            return callback({
                status: "Error - ",error:_
            })
        }

        let target;

        try {
            const res = await sqldb.findUserTarget(socket,payload.chat_id);
            target = res.dataValues.user_id;
        }catch(_){
            return `Error ${_}`
        }

        let chats;

        try {
            const res = await sqldb.getChatList(socket, payload.chat_id);
            chats = res;
        }catch(_){
            return callback({
                status:"Error",error:_
            })
        }


        socket.to(userRoom(target))
        .emit("message:sent", message);


        socket.to(userRoom(target))
        .emit("message:ack", chats);

        callback({
            status:"OK",
            data: message,
        })
    }
}