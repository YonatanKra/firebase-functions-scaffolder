const inquirer   = require('inquirer');
const files      = require('../files');

module.exports = {
    gFuncsInit: () => {
        const questions = [
            {
                name: 'functionsFolder',
                type: 'input',
                message: 'What is your functions folder?',
                default: 'functions'
            },
            /*TODO::add the dbHandler and responseHandler to template files{
                name: 'dbHandler',
                type: 'confirm',
                default: true,
                message: 'Would you like to setup a firebase dbHandler?'
            },
            {
                name: 'responseHandler',
                type: 'confirm',
                default: true,
                message: 'Would you like to setup an HTTP response handler?'
            },*/
            {
                name: 'typeScript',
                type: 'confirm',
                default: true,
                message: 'Are your functions set to use TypeScript?'
            }
        ];
        return inquirer.prompt(questions);
    },
};