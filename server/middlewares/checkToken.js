import { userRoom } from "../utils.js";

export const checkToken = (req, res, next) => {
  try {
    const authToken = req.user;
    if (!authToken) return res.status(401).send("Unauthrozied");
    next();
  } catch (_) {
    return { status: "ERROR", error: _ };
  }
};
