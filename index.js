#!/usr/bin/env node
const installer = require('./lib/installer');
const helpers = require('./lib/helpers');
const files = require('./lib/files');

const operator = process.argv[2];

if (operator === 'init') {
    return installer();
}

if (!helpers.verifyFirebase(process.cwd())) {
    return;
}

const FUNCTION_PATH = helpers.config.functionsFolder;
const PACKAGE_NAME = process.argv[3];

// now handle other params (currently only generate...)
switch(operator) {
    case 'g':
    case 'generate':
        files.createPackage(process.cwd() + '/' + FUNCTION_PATH, PACKAGE_NAME, helpers.config.typeScript);
        break;
    default:
        break;
}