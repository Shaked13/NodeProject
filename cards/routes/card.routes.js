import { Router } from "express";
import Card from "../models/Cards.schema.js";
import {
    getCardById, createNewCard, deleteCard, updateCard,
    toggleCardLike, getUserCards
} from "../services/cardsDataAccess.service.js";
import { auth } from "../../middlewares/token.js";
import { isUser } from "../../middlewares/isUser.js";
import { isBusiness } from "../../middlewares/isBusiness.js";
import { isAdmin } from "../../middlewares/isAdmin.js";
import { isRegisteredUser } from "../../middlewares/isRegisteredUser.js"

const cardsRouter = Router();


/* ----- GET All Cards ----- */
cardsRouter.get("/", async (req, res) => {
    try {
        const cards = await Card.find();
        return res.json(cards);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

/* ----- GET My Cards (Authenticated) ----- */
cardsRouter.get("/my-cards", auth, async (req, res) => {
    try {
        const myCards = await getUserCards(req.user._id);
        return res.json(myCards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ----- GET Card by ID ----- */
cardsRouter.get("/:id", async (req, res) => {
    try {
        const card = await getCardById(req.params.id);
        return res.json(card);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

/* ----- POST a New Card (Authenticated, Business User Only) ----- */
cardsRouter.post("/", auth, isBusiness, async (req, res) => {
    try {
        const cardData = { ...req.body, userId: req.user._id };
        const card = await createNewCard(cardData);
        return res.json(card);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

/* ----- PUT Update Card (Authenticated, User Only) ----- */
cardsRouter.put("/:id", auth, isRegisteredUser(true), async (req, res) => {
    try {
        const card = await updateCard(req.params.id, req.body);
        return res.json({ message: "Updated card successfully", card });
    } catch (err) {
        res.status(400).send(err.emssage);
    }
});

/* ----- DELETE Card (Authenticated, User Only) ----- */
cardsRouter.delete("/:id", auth, isUser, async (req, res) => {
    try {
        const card = await deleteCard(req.params.id);
        return res.json({ message: "Deleted card successfully", card });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

/* ----- PATCH Toggle Card Like (Authenticated) ----- */
cardsRouter.patch("/:id", auth, async (req, res) => {
    try {
        const card = await toggleCardLike(req.params.id, req.user._id);
        return res.json(card);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

/* ----- PATCH Change bizNumber (Authenticated, Admin Only) ----- */
cardsRouter.patch("/bizNumber/:id", auth, isAdmin, async (req, res) => {
    try {
        const existingCard = await Card.findOne({ bizNumber: req.body.bizNumber, _id: { $ne: req.params.id } });
        if (existingCard) {
            return res.status(409).json({ message: "bizNumber is already taken" });
        }

        const cardToUpdate = await Card.findById(req.params.id);
        cardToUpdate.bizNumber = req.body.bizNumber;
        await cardToUpdate.save();
        return res.json({ message: "bizNumber changed successfully", card: cardToUpdate });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

export default cardsRouter;
