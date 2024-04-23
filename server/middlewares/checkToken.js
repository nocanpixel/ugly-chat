import { userRoom, userState } from "../utils.js";

export const checkToken =
  ({ io }) =>
  (req, res, next) => {
    const authToken = req.session;
    if (!authToken) return res.status(401).send("Unauthrozied");

    next();
  };
