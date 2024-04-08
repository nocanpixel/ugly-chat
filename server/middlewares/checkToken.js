import jwt from 'jsonwebtoken';

export const checkToken = (req, res, next) => {
    const authToken = req.cookies.auth;
    // Check if the token is present in the cookie
    if(!authToken) return res.status(401).send('')
    try {
        // Verify the token
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        // Get the user information
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({
            message: "Invalid token"
        });
    }
};