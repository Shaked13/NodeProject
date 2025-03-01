import { connect } from 'mongoose';
import chalk from 'chalk'; //colors the prints in terminal

// to hide important sensitive stuff like our connection to the database

import dotenv from "dotenv"; // we import the env file . allows us to store sensitive information
// (like the database URL) in a .env file instead of hardcoding it into the code.

dotenv.config(); // connects to the env file (loads the variables from .env into process.env.)
const db = process.env.ENV === "dev" ? process.env.MONGO_LOCAL : process.env.MONGO_ATLAS;
const name = db === process.env.MONGO_LOCAL ? "local" : "atlas";

export const conn = async () => {
    try {
        await connect(db);
        console.log(chalk.magenta("Connected to MongoDB " + name));
    } catch (err) {
        console.log(err);
    };
};