import dotenv from "dotenv";
dotenv.config();
const { PASSWORD } = process.env;

// Add middleware to handle password errors
export const authorizedPassword = (req, res, next) => {
    const password = req.headers["x-auth-token"];

    // checks if the password exists in the header
    if (!password) {
        console.log("No token provided");
        return res.status(403).json({ message: "Unauthorized: No token provided" });
    }

    // checks if the password matches the one in the env
    if (password !== PASSWORD) {
        console.log("Incorrect password");
        return res.status(403).json({ message: "Unauthorized: Incorrect password" });
    }

    // If password is correct, proceed to the next middleware or route
    console.log("Password valid, proceeding...");
    next();
};
