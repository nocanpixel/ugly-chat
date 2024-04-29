
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { userRoom } from "../utils.js";

const ajv = new Ajv({
  useDefaults:true,
})


addFormats(ajv);

const validate = ajv.compile({
  type: "object",
  properties: {
    listener: { type: "boolean" },
    chat_id: {type: "string", format: "uuid"},
  }
})

export function emitSeen({ socket, sqldb }) {
  return async (payload, callback) => {
    const checkPayload = validate(payload);

    if(!checkPayload){
      return callback({
        status: "ERROR",
        errors: validate.errors,
      })
    }
    const chatId = payload.chat_id;
    const listener = payload.listener;

    let query;

    try {
      const response = await sqldb.updateSeenMessage({socket,chatId,listener});
      query = response;
    }catch(_){
      return {status:"ERROR",errors:_}
    }

    if(query&&query.length>0){
      socket.to(userRoom(query[0]?.userId))
      .emit("message:seen", query?.map(ele=> ele.messageId));

      socket.to(userRoom(query[0]?.userId))
      .emit("message:ackSeen", query?.map(ele=> ele.messageId));
    }


    

    callback({
      state:"Ok",
      response:`You have seen all the Messages, ${payload.listener}`,
    })
  };
}
