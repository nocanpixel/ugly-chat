// GENERATE_CRYPTO_SECRET
import { createHmac } from "node:crypto";
import moment from "moment";

export function userRoom(userId) {
    return `user:${userId}`;
}

export function userState(userId) {
    return `userState:${userId}`
}

export function generateIdentifier(username, email){
    const formatName = username.split(' ')[0].toLowerCase();
    const secret = process.env.GENERATE_CRYPTO_SECRET;

    const hash = createHmac('sha256', secret).update(email).digest('hex');

    return `${formatName}#${hash.substring(0,4)}`;

}




export function messageDate(date){
    const messageCreatedAt = date;
    const messageMoment = moment(messageCreatedAt);

    const today = moment().startOf("day");
    const startOfTheWeek = moment().startOf('isoWeek');
    const endOfWeek = moment().endOf('isoWeek');



    let formattedTimeOrDate;

    if (messageMoment.isSame(today, "day")) {
      formattedTimeOrDate = messageMoment.format("LT");
    } else if (
      messageMoment.isSame(today.clone().subtract(1, "day"), "day")
    ) {
      formattedTimeOrDate = "Yesterday";
    } else if (
      messageMoment.isBetween(startOfTheWeek, endOfWeek)  
    ) {
      formattedTimeOrDate = messageMoment.format("dddd");
    } else {
      formattedTimeOrDate = messageMoment.format("DD/MM/YYYY");
    }

    return formattedTimeOrDate;
}