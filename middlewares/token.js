import { verifyToken } from "../services/auth.service.js";

export const auth = async (req, res, next) => {
    try {
        const tokenFromClient = req.headers["x-auth-token"];
        const userInfo = verifyToken(tokenFromClient);

        if (!userInfo || !tokenFromClient) {
            throw new Error("Authentication Error: Unauthorize user");
        }

        req.user = userInfo;
        return next();

    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}
