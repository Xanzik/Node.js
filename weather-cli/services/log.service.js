import chalk from 'chalk';
import dedent from "dedent-js";

const printError = (error) => {
    console.log(chalk.bgRed(' ERROR ' + ' ' + error));
};

const printSuccess = (message) => {
    console.log(chalk.bgGreen(' SUCCESS ' + ' ' + message));
};

const printHelp = () => {
    console.log(
        dedent`${chalk.bgCyan(' HELP ')}
        Without parameters - to display help
        -s [CITY] to set the city
        -h to display help
        -t [API_KEY] to set the token
        `
    );
};

export { printError, printSuccess, printHelp };