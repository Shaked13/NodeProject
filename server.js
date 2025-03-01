import express from 'express';
import router from './router/router.js';
import chalk from 'chalk'; //colors the prints in terminal
import { badRequest } from './middlewares/badRequest.js';
import { morganLogger } from './middlewares/logger.js';
import { conn } from './services/db.service.js';
import userSeed from "./users/initialData/initialUsers.json" with {type: "json"};
import cardSeed from "./cards/initialData/initialCards.json" with {type: "json"};
import User from "./users/models/User.schema.js";
import Card from "./cards/models/Cards.schema.js";
import { hashPassword } from './users/services/password.service.js';

const app = express();

const PORT = 8080;

// Add middleware to parse JSON, maximum request body size is 5mb
app.use(express.json({ limit: '5mb' }));

// Add logger middleware - is a logging middleware (like console.log for HTTP requests)
app.use(morganLogger);

// Add the router to the app
app.use(router);

// Add middleware to handle 404 errors
app.use(badRequest);

// Add middleware to handle 500 errors
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).send("Something broke!");
});

app.listen(PORT, async () => {
    console.log(chalk.magenta(`Server is running on port ${PORT}`));
    await conn();

    // Retrieve all existing user data from the database
    const usersFromDb = await User.find();

    // Seed new user data into the database
    try {
        // Loop through each user in the 'userSeed' array
        userSeed.forEach(async (user) => {
            // Check if the user's email already exists in the database
            if (usersFromDb.find((dbUser) => dbUser.email === user.email)) {
                // If the user exists, skip adding them
                return;
            }

            // If the user doesn't exist, create a new user instance
            const newUser = new User(user);

            newUser.password = await hashPassword(newUser.password);

            // Save the new user to the database
            await newUser.save();
            console.log("User created ", newUser.email);
        });

        const cardsLength = await Card.find().countDocuments();


        if (cardsLength > 3) {
            return;
        };

        cardSeed.forEach(async (card) => {
            const newCard = new Card(card);
            await newCard.save();
        });


    } catch (err) {
        console.log(err);
    }
});