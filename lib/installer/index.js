const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');

const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');

const inquirer  = require('./inquirer');
const files = require('../files');
const helpers = require('../helpers');

const rootPath = process.cwd();
const npmInstalls = ["jest", "ts-jest", "@types/jest"];
var spawn = require('child_process').spawn;

function npmInstall(config) {
    let tmpNpmInstalls = npmInstalls.slice();
    if (!config.typeScript) {
        tmpNpmInstalls = tmpNpmInstalls.slice(0);
    }
    return new Promise((res, rej) => {

        const ls = spawn(`npm i -D ${tmpNpmInstalls.join(' ')}`, {
            shell: true,
            cwd: path.join(process.cwd(), config.functionsFolder)
        });

        ls.stdout.on('data', function (data) {
            console.log('stdout: ' + data.toString());
        });

        ls.stderr.on('data', function (data) {
            console.log('stderr: ' + data.toString());
            rej(data);
        });

        ls.on('exit', function (code) {
            console.log('child process exited with code ' + code.toString());
            res(code);
        });
    });


}

function setupTests() {
    // now update the package json with the functions-test and functions-test:watch commands

}

function getPackageJson(functionsFolder) {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), `${functionsFolder}/package.json`), 'utf8'));
}

async function setupTypescriptTests(functionsFolder) {
    await exec(`cd ${functionsFolder} && ts-jest init && cd ..`);
    // now update the package json with the functions-test and functions-test:watch commands
}

function postInstall(config) {

    // if ts, use ts-init via the cli
    if (config.typeScript) {
        setupTypescriptTests(config.functionsFolder);
    }

    // add test-functions and test-functions:watch commands to package.json
    setupTests();
}

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
    await npmInstall(config);
    postInstall(config);
};