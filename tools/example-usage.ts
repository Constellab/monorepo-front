import path from 'path';
import { fixImportsInFolder } from './import-fixer';
import { generatePublicApi } from './generate-public-api';
import { extractTranslationStrings } from './string-extractor';
import { TranslationMigrator } from './translation-migrator';
import { TranslationCleaner } from './translation-cleaner';
import { TranslationManager } from './translation-manager';


// // Fix imports in a folder
// const folderPath = path.resolve(__dirname, '../libs/lab-lib/');
// const result = fixImportsInFolder(folderPath);
// console.log(result);

// Generate public-api.ts files
// const publicApiFolder = path.resolve(__dirname, '../libs/lab-lib/src/lib/li-model');
// const publicApiResult = generatePublicApi(publicApiFolder).then()
// console.log(publicApiResult);


//////////////////////////////// TRANSLATION /////////////////////////////////////////
// Get command line arguments
const sourceTranslation = path.resolve(__dirname, '../apps/lab-front/src/assets/i18n');
const targetTranslation = path.resolve(__dirname, '../apps/lab-front/src/assets/i18n/destination');
const sourceFolder = path.resolve(__dirname, '../apps/lab-front');
const targetFolder = path.resolve(__dirname, '../apps/lab-front');

// Check keys
const manager = new TranslationManager(sourceTranslation);
// // Check if all locales have the same number of keys
const countCheck = manager.hasConsistentKeyCount();
console.log(`Consistent key count: ${countCheck.consistent}`);
console.log('Counts by locale:', countCheck.countsByLocale);
//
// // Get all missing translation keys
const missingKeys = manager.getMissingTranslationKeys();
console.log('Missing keys by locale:', missingKeys);

// const migrator = new TranslationMigrator(
//   sourceTranslation, targetTranslation, sourceFolder, {targetFile: 'lab-global.json', parentKey: 'g'}
// );
//
// migrator.migrate();

// const cleaner = new TranslationCleaner(sourceTranslation, sourceFolder);
// const result = cleaner.deleteUnusedTranslations();
//
// console.log(`Cleaned translations: ${result.deleted} deleted, ${result.remaining} remaining out of ${result.total} total`);

