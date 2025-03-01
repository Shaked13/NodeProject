import { Router } from "express";
import usersRouter from "../users/routes/user.routes.js"
import cardsRouter from "../cards/routes/card.routes.js";

const router = Router();

router.get("/", (req, res) => {
    throw new Error("This is an error");
});

router.use("/users", usersRouter);
router.use("/cards", cardsRouter);

export default router;