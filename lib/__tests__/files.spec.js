const files = require('../files');
const path = require('path');
const mockfs = require('mock-fs');
const fs = require('fs');

const config = {
    functionFolder: 'function',
    dbHandler: false,
    responseHandler: false,
    typeScript: false
};
const CONFIG_ROOT = 'configRoot';

describe(`files`, () => {

    afterEach(() => {
        mockfs.restore()
    });

    describe(`directoryExists`, () => {
        beforeEach(() => {
            mockfs({
                'existing/dir': {
                    // this is empty
                }
            })
        });

        it(`should return false if directory doesn't exist`, () => {
            expect(files.directoryExists('nonExisting/dir')).toBe(false);
        });

        it(`should return the folder's stats`, () => {
            expect(files.directoryExists('existing/dir')).toBeTruthy();
        });
    });

    describe(`readConfig`, () => {
        beforeEach(() => {
            mockfs({
                "gfuncs.conf.json": JSON.stringify(config)
            })
        });
        it(`should throw if file does not exist`, () => {
            fs.unlinkSync("gfuncs.conf.json"); //remove the file - an error should be thrown
            expect(() => files.readConfig()).toThrowErrorMatchingSnapshot();
        });

        it(`should return the configuration as a JSON`, () => {
            expect(files.readConfig()).toEqual(config);
        });
    });

    describe(`saveConfig`, () => {
        it(`should write the config file`, () => {
            const config = {test: 'test'};
            files.saveConfig(config);
            const json = fs.readFileSync(path.join(process.cwd(), 'gfuncs.conf.json'), 'utf8');
            expect(JSON.parse(json))
                .toEqual(config);
        });
    });

    describe(`createFolder`, () => {
        beforeEach(() => {
            mockfs({
                "existing": {
                    "folder": {}
                },
                "nonexisting": {}
            })
        });

        it(`should return an error if folder already exists`, () => {
            expect(files.createFolder("existing", "folder")).toMatchSnapshot();
        });

        it(`should create the folder`, () => {
            files.createFolder("nonexisting", "folder");
            expect(fs.statSync('nonexisting/folder').isDirectory()).toBe(true);
        });
    });

    describe(`createPackage`, () => {
        it(`should create the package folder with packageName`, () => {

        });

        it(`should copy the js files to the folder`, () => {

        });

        it(`should copy the ts files if ts is defined`, () => {

        });

        it(`should change the %FuncName% to packageName`, () => {

        });
    });
});