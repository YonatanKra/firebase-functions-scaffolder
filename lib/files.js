const fs = require('fs');
const path = require('path');

function replacePackageName(packageName, fileContents) {
    return fileContents.replace(/%funcName/g, packageName);
}

function copyTemplateFile(packageName, suffix, functionsPath, spec) {
    if (spec) {
        suffix = 'spec.' + suffix;
    }

    // read main file
    let templateContent = fs.readFileSync(path.join(__dirname, './templates/') + `function.${suffix}`, 'utf8');
    // replace %funcName% with packageName
    templateContent = replacePackageName(packageName, templateContent);
    // write file
    let writePath = `${functionsPath}/src/${packageName}/${packageName}.${suffix}`;
    fs.writeFileSync(writePath, templateContent, 'utf8');
}

module.exports = {
    getCurrentDirectoryBase : function() {
        return path.basename(process.cwd());
    },
    directoryExists : function(filePath) {
        try {
            return fs.statSync(filePath).isDirectory();
        } catch (err) {
            return false;
        }
    },
    readConfig: function() {
        const root = process.cwd();
        try {
            return JSON.parse(fs.readFileSync(path.join(root, 'gfuncs.conf.json'), 'utf8'));
        } catch(e) {
            throw new Error('gfuncs.conf.json is not found. Please run gfuncs init.');
        }
    },
    saveConfig: function (config) {
        const json = JSON.stringify(config);
        fs.writeFileSync(path.join(process.cwd(), 'gfuncs.conf.json'), json, 'utf8');
    },
    createFolder(fsPath, folderName) {
        const filePath = path.join(fsPath, folderName ? folderName : '');
        if (this.directoryExists(filePath)) {
            return new Error(`Folder ${filePath} already exists.`);
        }
        fs.mkdirSync(filePath);
    },
    createPackage(functionsPath, packageName, typeScript = false) {
        this.createFolder(functionsPath + '/src', packageName);
        let suffix = typeScript ? 'ts' : 'js';
        copyTemplateFile(packageName, suffix, functionsPath, false);
        copyTemplateFile(packageName, suffix, functionsPath, true);
    }
};