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
        let template, specTemplate;

        describe(`js`, () => {
            beforeEach(() => {
                template = fs.readFileSync(path.join(process.cwd(), 'lib/templates/') + `function.js.tmpl`, 'utf8');
                specTemplate = fs.readFileSync(path.join(process.cwd(), 'lib/templates/') + `function.spec.js.tmpl`, 'utf8');
                mockfs({
                    "functionsFolder": {},
                    "lib": {
                        "templates": {
                            "function.js.tmpl": template,
                            "function.spec.js.tmpl": specTemplate
                        }
                    }
                });
                files.createPackage("functionsFolder", "packageName");
            });

            it(`should create the package folder with packageName`, () => {
                expect(fs.statSync('functionsFolder/packageName').isDirectory()).toBe(true);
            });

            it(`should copy the js files to the folder`, () => {
                expect(fs.statSync('functionsFolder/packageName/packageName.js').isFile()).toBe(true);
                expect(fs.statSync('functionsFolder/packageName/packageName.spec.js').isFile()).toBe(true);
            });

            it(`should replace the %FuncName% with packageName`, () => {

                const template = fs.readFileSync('functionsFolder/packageName/packageName.js', 'utf8');
                const specTemplate = fs.readFileSync('functionsFolder/packageName/packageName.spec.js', 'utf8');

                expect(template).toMatchSnapshot();
                expect(specTemplate).toMatchSnapshot();
            });
        });
        
        describe(`ts`, () => {
            beforeEach(() => {
                template = fs.readFileSync(path.join(process.cwd(), 'lib/templates/') + `function.ts.tmpl`, 'utf8');
                specTemplate = fs.readFileSync(path.join(process.cwd(), 'lib/templates/') + `function.spec.ts.tmpl`, 'utf8');
                mockfs({
                    "functionsFolder": {
                        "src": {}
                    },
                    "lib": {
                        "templates": {
                            "function.ts.tmpl": template,
                            "function.spec.ts.tmpl": specTemplate
                        }
                    }
                });
                files.createPackage("functionsFolder", "packageName", true);
            });

            it(`should create the package folder with packageName under src folder`, () => {
                expect(fs.statSync('functionsFolder/src/packageName').isDirectory()).toBe(true);
            });

            it(`should copy the ts files if ts is defined`, () => {
                expect(fs.statSync('functionsFolder/src/packageName/packageName.ts').isFile()).toBe(true);
                expect(fs.statSync('functionsFolder/src/packageName/packageName.spec.ts').isFile()).toBe(true);
            });

            it(`should replace the %FuncName% with packageName`, () => {

                const template = fs.readFileSync('functionsFolder/src/packageName/packageName.ts', 'utf8');
                const specTemplate = fs.readFileSync('functionsFolder/src/packageName/packageName.spec.ts', 'utf8');

                expect(template).toMatchSnapshot();
                expect(specTemplate).toMatchSnapshot();
            });
        });


    });
});