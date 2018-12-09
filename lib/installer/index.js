const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');

const inquirer  = require('./inquirer');
const files = require('../files');
const helpers = require('../helpers');

const rootPath = process.cwd();

module.exports = async () => {
    clear();
    if (!helpers.verifyFirebase(rootPath)) {
        return;
    }
    console.log(
        chalk.yellow(
            figlet.textSync('GFunc Scaffolder', { horizontalLayout: 'full' })
        )
    );

    const config = await inquirer.gFuncsInit();
    files.saveConfig(config);
};