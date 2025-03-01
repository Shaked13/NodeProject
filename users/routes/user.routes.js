import { Router } from "express";
import User from "../models/User.schema.js";
import { changeAuthLevel, createNewUser, deleteUser, existingUser, getUserById, updateUser } from "../services/usersDataAccess.service.js";
import { validate } from "../../middlewares/validation.js";
import LoginSchema from "../validations/LoginSchema.js";
import RegisterSchema from "../validations/RegisterSchema.js";
import { generateToken } from "../../services/auth.service.js";
import { auth } from "../../middlewares/token.js";
import { isAdmin } from "../../middlewares/isAdmin.js";
import { isUser } from "../../middlewares/isUser.js";

import lodash from "lodash";
import { isRegisteredUser } from "../../middlewares/isRegisteredUser.js";
const { pick } = lodash;

const router = Router();

router.get("/", auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        const newUser = users.map(user => pick(user, ["name", "image", "_id", "isBusiness", "email", "address", "phone"]));
        return res.json(newUser);
    } catch (err) {
        return res.status(500).send(err.message);
    };
});

// get user by id
router.get("/:id", auth, isUser, async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        return res.json(user);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

// create a new user
router.post("/register", validate(RegisterSchema), async (req, res) => {
    try {
        const user = await createNewUser(req.body);
        return res.json({ message: "new user created successfully", user });
    } catch (err) {
        return res.status(500).send(err.message);
    };
})

router.post("/login", validate(LoginSchema), async (req, res) => {
    try {
        const user = await existingUser(req.body);
        return res.json(generateToken(user));
    } catch (err) {
        if (err.message === "No user found with the provided email address") {
            return res.status(404).send(err.message); //not found
        };
        if (err.message === "Password is incorrect") {
            return res.status(401).send(err.message); // Unauthorized
        };
        return res.status(500).send(err.message);
    };
});

// delete user
router.delete("/:id", auth, isUser, async (req, res) => {
    try {
        const user = await deleteUser(req.params.id);
        return res.json({ message: "user deleted successfully", user });
    } catch (err) {
        return res.status(500).send(err.message);
    };
});

// update a user
router.put("/:id", auth, isRegisteredUser(false), async (req, res) => {
    try {
        const user = await updateUser(req.params.id, req.body);
        return res.json({ message: "user updated successfully", user });
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

// PATCH request to change the authLevel
router.patch("/:id", auth, isAdmin, async (req, res) => {
    try {
        const findUser = await changeAuthLevel(req.params.id);
        return res.json(findUser);
    } catch (err) {
        return res.status(500).send(err.message);
    };
});


router.post("/login", validate(LoginSchema), async (req, res) => {
    try {
        const user = await existingUser(req.body);
        return res.json(generateToken(user));
    } catch (err) {
        //to handle specific error messages
        if (err.message === "No user found with the provided email address") {
            return res.status(404).send(err.message); //not found
        };

        if (err.message === "Password is incorrect") {
            return res.status(401).send(err.message); // Unauthorized
        };
        // For other unexpected error, we return a 500 status
        return res.status(500).send(err.message);
    };
});

export default router;