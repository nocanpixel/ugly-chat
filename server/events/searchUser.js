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
        q: { type: "string", minLength:4, maxLength:20 },
        target: { type: "string", format:"uuid" }
    },
    required: ["q"],
    additionalProperties:false,
})

export function searchUser({socket,sqldb}){
    return async (payload, callback) => {

        const checkPayload = validate(payload);

        if(!checkPayload){
            return callback({
                status:"ERROR",
                errors: validate.errors,
            })
        }

        const tag = payload.q;
        const userId = socket.userId;

        const users = await sqldb.searchUser({socket,userId, tag});

        if(users.qStatus==='SUCCESS'){
            socket.to(userRoom(users.data))
            .emit("friend:request", true);
        }
    
        callback({
            status:"Ok",
            data: users
        })
    }
}