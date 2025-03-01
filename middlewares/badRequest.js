import chalk from 'chalk'; //colors the prints in terminal
// Add middleware to handle 404 errors
export const badRequest = (req, res) => {
    console.log(chalk.redBright(`404 - Not Found`));

    res.status(404).json({ message: "Not found" });

};