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

        try{
            message = await sqldb.sendMessage(socket,payload.chat_id,payload.context);
        }catch(_){
            return callback({
                status: "Error",
            })
        }

        let target;

        try {
            const res = await sqldb.findUserTarget(socket,payload.chat_id);
            target = res.dataValues.user_id;
        }catch(_){
            return `Error ${_}`
        }

        socket.to(userRoom(target))
        .emit("message:sent", message);

        callback({
            status:"OK",
            data: message,
        })
    }
}