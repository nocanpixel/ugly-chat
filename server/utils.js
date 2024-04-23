// GENERATE_CRYPTO_SECRET

import { createHmac } from "node:crypto";

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
