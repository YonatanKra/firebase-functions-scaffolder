const path = require('path');
const files = require('./files');

let config;
module.exports = {
    verifyFirebase: function verifyFirebase(rootPath) {
        try {
            const fbConfig = require(path.resolve(rootPath, 'firebase.json'));
            if (!fbConfig.functions) {
                throw('The firebase project does not use functions');
            }
            return true;

        } catch (e) {
            if (e.code === 'MODULE_NOT_FOUND') {
                console.error('Directory is not a firebase project');
            } else {
                console.error(e);
            }
            return false;
        }
    },
    get config() {
        if (!config) {
            config = files.readConfig();
        }
        return config;
    }
};

