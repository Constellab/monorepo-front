import * as path from 'path';
import { TranslationManager } from './translation-manager';
import { extractTranslationStrings, StringExtractorFileResult } from './string-extractor';

export class TranslationCleaner {
  private translationManager: TranslationManager;
  private appStrings: string[] = [];
  private readonly translationFolderPath: string;
  private readonly appFolderPath: string;

  /**
   * Creates a new TranslationCleaner instance
   * @param translationFolderPath Path to the folder containing translation files
   * @param appFolderPath Path to the application folder to extract strings from
   */
  constructor(translationFolderPath: string, appFolderPath: string) {
    this.translationFolderPath = translationFolderPath;
    this.appFolderPath = appFolderPath;
    this.translationManager = new TranslationManager(translationFolderPath);

    // Validate paths
    if (!this.translationFolderPath || !this.appFolderPath) {
      throw new Error('Translation folder and app folder paths are required');
    }
  }

  /**
   * Loads all strings from the app folder
   * @returns The TranslationCleaner instance for chaining
   */
  private loadAppStrings(): TranslationCleaner {
    console.log(`Loading strings from app folder: ${this.appFolderPath}`);
    const extractedResults: StringExtractorFileResult[] = extractTranslationStrings(this.appFolderPath);

    // Flatten all strings from all files into a single array
    this.appStrings = extractedResults.reduce((acc: string[], result) => {
      return [...acc, ...result.strings];
    }, []);

    console.log(`Found ${this.appStrings.length} unique strings in application files`);
    return this;
  }

  /**
   * Checks if a string contains any uppercase characters
   * @param str The string to check
   * @returns True if the string contains at least one uppercase character
   */
  private containsUppercase(str: string): boolean {
    return /[A-Z]/.test(str);
  }

  /**
   * Checks if a translation key is used in the app
   * This is a simple check that looks for the key in the extracted strings
   * @param key The translation key to check
   * @returns True if the key is found in the app strings or contains uppercase characters
   */
  private isTranslationKeyUsed(key: string): boolean {
    // Skip keys with uppercase characters (consider them as used)
    if (this.containsUppercase(key)) {
      return true;
    }

    // Convert dot notation to potential usage patterns
    const keyParts = key.split('.');
    const lastPart = keyParts[keyParts.length - 1];

    // Check if the key or its parts are found in extracted strings
    return this.appStrings.some(str =>
      str.includes(key) ||
      str.includes(lastPart) ||
      str.includes(`'${key}'`) ||
      str.includes(`"${key}"`)
    );
  }

  /**
   * Deletes translations that are not used in the app
   * @returns Object containing statistics about the cleaning operation
   */
  public deleteUnusedTranslations(): { total: number, deleted: number, remaining: number, skippedUppercase: number } {
    // First load all translations and app strings
    this.translationManager.loadTranslations();
    this.loadAppStrings();

    const allTranslations = this.translationManager.getAllTranslations();
    console.log(`Loaded ${allTranslations.length} translations`);

    // Track unique keys to avoid checking the same key multiple times
    const processedKeys = new Set<string>();
    let deletedCount = 0;
    let skippedUppercaseCount = 0;

    // Process each translation key only once (across all locales)
    for (const translation of allTranslations) {
      const { key } = translation;

      if (processedKeys.has(key)) continue;
      processedKeys.add(key);

      if (this.containsUppercase(key)) {
        skippedUppercaseCount++;
        continue;
      }

      if (!this.isTranslationKeyUsed(key)) {
        this.translationManager.deleteTranslation(key);
        deletedCount++;
      }
    }

    // Save the changes
    this.translationManager.regenerateTranslationFiles();

    // Return stats
    const remainingCount = this.translationManager.getAllTranslations().length;
    return {
      total: allTranslations.length,
      deleted: deletedCount,
      remaining: remainingCount,
      skippedUppercase: skippedUppercaseCount
    };
  }
}

// Example usage:
/*
const translationsDir = 'c:/Users/benji/Documents/Projects/Gencovery/monorepo-front/apps/lab-front/src/assets/i18n';
const appDir = 'c:/Users/benji/Documents/Projects/Gencovery/monorepo-front/apps/lab-front/src';

const cleaner = new TranslationCleaner(translationsDir, appDir);
const result = cleaner.deleteUnusedTranslations();

console.log(`Cleaned translations: ${result.deleted} deleted, ${result.remaining} remaining out of ${result.total} total`);
console.log(`Skipped ${result.skippedUppercase} keys with uppercase characters`);
*/

