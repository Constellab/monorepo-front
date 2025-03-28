import path from 'path';
import { fixImportsInFolder } from './import-fixer';
import { generatePublicApi } from './generate-public-api';


// Fix imports in a folder
const folderPath = path.resolve(__dirname, '../libs/lab-lib/');
const result = fixImportsInFolder(folderPath);
console.log(result);

// Generate public-api.ts files
// const publicApiFolder = path.resolve(__dirname, '../libs/lab-lib/src/lib/li-model');
// const publicApiResult = generatePublicApi(publicApiFolder).then()
// console.log(publicApiResult);
