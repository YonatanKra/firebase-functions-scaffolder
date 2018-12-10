# firebase-functions-scaffolder
A small scaffolding library to easily add google functions with testing infrastructure built in.
# Installation
`npm i firebase-functions-scaffolder -g`
# Usage
In your firebase project, use the cli command: `gfuncs init`
It should prompt you for questions (your functions folder and weather you are using typescript or not).

Once initialized, you can now use:
`gfuncs g myFunctionName`

It will create a folder with two files inside your `%functions%/src` folder (%functions% will be replaced by whatever you chose during init). One file would be a spec file, while the other would be the actual function file.
You would be able to now require the file from your `index.js` (or `ts`) and export it as another function.

Example:
1) Create a new google function: `gfuncs g newFunction`
2) Inside your `index.ts`
```
import {newFunction} from './newFunction/newFunction';
export const newFunctionHandler = functions.https.onRequest((request, response) => {
  return newFunction(request, response);
});
```
or if using plain javascript:
```
const newFunction = require('./newFunction/newFunction');
module.exports = {
  newFunctionHandler: functions.https.onRequest((request, response) => {
    return newFunction(request, response);
  })
};
```
