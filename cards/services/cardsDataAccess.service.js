import Card from "../models/Cards.schema.js"
import lodash from "lodash";
const { pick } = lodash;

// get card by id
const getCardById = async (cardId) => {
    try {
        const card = await Card.findById(cardId);
        if (!card) {
            throw new Error("Card not found");
        }
        const returnCard = pick(card, ["name", "image", "_id", "isBusiness", "email", "address"]);
        return returnCard;
    } catch (err) {
        throw new Error(err.message);
    };
};

// create a new card
const createNewCard = async (cardData) => {
    try {
        const newCard = new Card(cardData);
        if (!cardData) {
            throw new Error("Card Was Not Created");
        };
        if (!cardData.bizNumber) {
            newCard.bizNumber = Math.floor(100000 + Math.random() * 900000);
        };
        await newCard.save();
        return newCard;
    } catch (err) {
        throw new Error(err.message);
    };
};

// delete a card
const deleteCard = async (cardId) => {
    try {
        const card = await Card.findByIdAndDelete(cardId);
        if (!card) {
            throw new Error("card was not found");
        };
        return card;
    } catch (err) {
        throw new Error(err.message);
    };
};

// update user details
const updateCard = async (cardId, cardData) => {
    try {
        const card = await Card.findByIdAndUpdate(cardId, cardData, { new: true });
        if (!card) {
            throw new Error("Card Was Not Found");
        };
        return card;
    } catch (err) {
        throw new Error(err.message);
    };
};

// change authLevel for the user
const changeAuthLevel = async (userId) => {
    try {
        const findUser = await User.findById(userId);
        if (findUser.authLevel === 1) {
            findUser.authLevel = 2;
        };
        await findUser.save();
        return findUser;
    } catch (err) {
        throw new Error(err.message);
    };
};

const toggleCardLike = async (cardId, userId) => {
    try {
        const card = await Card.findById(cardId);
        if (!card) {
            throw new Error("Card Was Not Found");
        };
        if (card.likes.includes(userId)) {
            card.likes = card.likes.filter(id => id.toString() !== userId);
        } else {
            card.likes.push(userId)
        };
        await card.save();
        return card;
    } catch (err) {
        throw new Error(err.message);
    };
};

const getUserCards = async (userId) => {
    try {
        const myCards = await Card.find({ userId: userId });
        if (myCards.length === 0) {
            throw new Error("You have no cards yet");
        };
        return myCards;
    } catch (err) {
        throw new Error(err.message);
    }
};

export { getCardById, createNewCard, deleteCard, updateCard, changeAuthLevel, toggleCardLike, getUserCards };