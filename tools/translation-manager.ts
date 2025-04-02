import * as fs from 'fs';
import * as path from 'path';

// Interfaces to represent translation data
interface TranslationItem {
  key: string;
  value: string | Record<string, any>;
  originFile: string;
  locale: string;
}

interface TranslationFile {
  filename: string;
  locale: string;
  baseFilename: string;
  content: Record<string, any>;
}

export class TranslationManager {
  private translations: TranslationItem[] = [];
  private translationFiles: TranslationFile[] = [];
  private readonly folderPath: string;

  constructor(folderPath: string) {
    this.folderPath = folderPath;
    this.loadTranslations();
  }

  /**
   * Loads all translation files from a directory
   * @returns The TranslationMigrator instance for chaining
   */
  public loadTranslations(): TranslationManager {
    if (!fs.existsSync(this.folderPath)) {
      throw new Error(`Directory does not exist: ${this.folderPath}`);
    }

    const files = fs.readdirSync(this.folderPath);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    // Group files by their base name (e.g., 'lab-biota' for 'lab-biota-en.json')
    const fileGroups: Record<string, string[]> = {};

    for (const file of jsonFiles) {
      // Extract base filename and locale (e.g., 'lab-biota' and 'en' from 'lab-biota-en.json')
      const match = file.match(/(.+)-([a-z]{2})\.json$/);
      if (match) {
        const baseFilename = match[1];
        if (!fileGroups[baseFilename]) {
          fileGroups[baseFilename] = [];
        }
        fileGroups[baseFilename].push(file);
      }
    }

    // Process each file
    for (const baseFilename in fileGroups) {
      for (const file of fileGroups[baseFilename]) {
        const filePath = path.join(this.folderPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        // Extract locale (e.g., 'en' from 'lab-biota-en.json')
        const locale = file.match(/-([a-z]{2})\.json$/)?.[1] || '';

        // Store file data
        this.translationFiles.push({
          filename: file,
          locale,
          baseFilename,
          content: data
        });

        // Process and flatten translations
        this.processTranslations(data, file, locale);
      }
    }

    return this;
  }

  /**
   * Recursively processes translations from a JSON object
   * @param obj The JSON object
   * @param filename The origin filename
   * @param locale The locale code
   * @param prefix The current prefix for nested keys
   */
  private processTranslations(
    obj: Record<string, any>,
    filename: string,
    locale: string,
    prefix: string = ''
  ): void {
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursive call for nested objects
        this.processTranslations(obj[key], filename, locale, fullKey);
      } else {
        // Add leaf translation
        this.translations.push({
          key: fullKey,
          value: obj[key],
          originFile: filename,
          locale
        });
      }
    }
  }

  /**
   * Checks if a translation key exists
   * @param key The translation key (can include dots for nested properties)
   * @param locale Optional locale to check. If not provided, checks if the key exists in any locale
   * @returns True if the translation exists
   */
  public hasTranslation(key: string, locale?: string): boolean {
    if (locale) {
      return this.translations.some(t => t.key === key && t.locale === locale);
    }
    return this.translations.some(t => t.key === key);
  }

  /**
   * Gets a translation by key
   * @param key The translation key
   * @param locale The locale
   * @returns The translation value or undefined if not found
   */
  public getTranslation(key: string, locale: string): string | undefined {
    const translation = this.translations.find(t => t.key === key && t.locale === locale);
    return translation?.value as string;
  }

  public getTranslationAllLocales(key: string): TranslationItem[] {
    return this.translations.filter(t => t.key === key);
  }

  /**
   * Adds a new translation or updates an existing one
   * @param key The translation key
   * @param value The translation value
   * @param locale The locale
   * @param originFile The origin file
   */
  public addTranslation(key: string, value: string, locale: string, originFile: string): void {
    // If origin file not specified, try to determine it
    if (!originFile) {
      // Find existing translation with the same key in any locale to determine file
      const existingTranslation = this.translations.find(t => t.key === key);
      if (existingTranslation) {
        // Extract base filename
        const baseFilenameMatch = existingTranslation.originFile.match(/(.+)-[a-z]{2}\.json$/);
        if (baseFilenameMatch) {
          originFile = `${baseFilenameMatch[1]}-${locale}.json`;
        }
      } else {
        // If no existing translation, use the first file for this locale
        const fileForLocale = this.translationFiles.find(f => f.locale === locale);
        if (fileForLocale) {
          originFile = fileForLocale.filename;
        } else {
          throw new Error(`Cannot determine origin file for locale: ${locale}`);
        }
      }
    }

    // Check if the translation already exists
    const existingIndex = this.translations.findIndex(
      t => t.key === key && t.locale === locale
    );

    if (existingIndex >= 0) {
      // Update existing translation
      this.translations[existingIndex].value = value;
    } else {
      // Add new translation
      this.translations.push({
        key,
        value,
        originFile,
        locale
      });
    }
  }

  /**
   * Deletes a translation
   * @param key The translation key
   * @param locale Optional locale. If not provided, deletes the key from all locales
   * @returns True if any translations were deleted
   */
  public deleteTranslation(key: string, locale?: string): boolean {
    const initialLength = this.translations.length;

    if (locale) {
      this.translations = this.translations.filter(
        t => !(t.key === key && t.locale === locale)
      );
    } else {
      this.translations = this.translations.filter(t => t.key !== key);
    }

    return initialLength > this.translations.length;
  }

  /**
   * Regenerates the translation files with current data
   */
  public regenerateTranslationFiles(): void {
    // Group translations by file
    const fileMap: Record<string, Record<string, any>> = {};

    // Initialize files with empty objects
    for (const file of this.translationFiles) {
      fileMap[file.filename] = {};
    }

    // Process each translation
    for (const translation of this.translations) {
      const { key, value, originFile } = translation;

      // Ensure the file exists in our map
      if (!fileMap[originFile]) {
        fileMap[originFile] = {};
      }

      // Set the value in the nested structure
      this.setNestedValue(fileMap[originFile], key, value);
    }

    // Write files to disk
    for (const filename in fileMap) {
      const filePath = path.join(this.folderPath, filename);
      fs.writeFileSync(
        filePath,
        JSON.stringify(fileMap[filename], null, 2),
        'utf-8'
      );
    }
  }

  /**
   * Helper method to set a value in a nested object structure
   * @param obj The object to modify
   * @param key The key with dots for nesting
   * @param value The value to set
   */
  private setNestedValue(obj: Record<string, any>, key: string, value: any): void {
    const parts = key.split('.');
    let current = obj;

    // Navigate to the right nesting level
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    // Set the value at the final level
    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
  }

  /**
   * Gets all loaded translations
   * @returns Array of all translation items
   */
  public getAllTranslations(): TranslationItem[] {
    return [...this.translations];
  }

  /**
   * Gets a list of all available locales
   * @returns Array of locale codes
   */
  public getLocales(): string[] {
    return [...new Set(this.translations.map(t => t.locale))];
  }

  /**
   * Checks if a translation key exists in all available locales
   * @param key The translation key to check
   * @returns An object with the result and missing locales if any
   */
  public isKeyInAllLocales(key: string): { exists: boolean; missingLocales: string[] } {
    const locales = this.getLocales();
    const missingLocales: string[] = [];

    for (const locale of locales) {
      if (!this.hasTranslation(key, locale)) {
        missingLocales.push(locale);
      }
    }

    return {
      exists: missingLocales.length === 0,
      missingLocales
    };
  }

  /**
   * Checks if all locales have the same number of translation keys
   * @returns An object with the result and counts by locale if inconsistent
   */
  public hasConsistentKeyCount(): { consistent: boolean; countsByLocale: Record<string, number> } {
    const locales = this.getLocales();
    const countsByLocale: Record<string, number> = {};

    // Count keys for each locale
    for (const locale of locales) {
      const localeTranslations = this.translations.filter(t => t.locale === locale);
      countsByLocale[locale] = localeTranslations.length;
    }

    // Check if all counts are the same
    const counts = Object.values(countsByLocale);
    const consistent = counts.every(count => count === counts[0]);

    return {
      consistent,
      countsByLocale
    };
  }

  /**
   * Gets a list of keys that are missing in some locales but present in others
   * @returns An object mapping keys to the locales where they are missing
   */
  public getMissingTranslationKeys(): Record<string, string[]> {
    const locales = this.getLocales();
    const allKeys = new Set<string>();
    const result: Record<string, string[]> = {};

    // Collect all keys across all locales
    for (const item of this.translations) {
      allKeys.add(item.key);
    }

    // Check each key for presence in all locales
    for (const key of allKeys) {
      const { exists, missingLocales } = this.isKeyInAllLocales(key);

      if (!exists) {
        result[key] = missingLocales;
      }
    }

    return result;
  }
}

// Example usage:
/*
const translationsDir = 'c:/Users/benji/Documents/Projects/Gencovery/monorepo-front/apps/lab-front/src/assets/i18n';
const manager = new TranslationManager(translationsDir);

// Check if a translation exists
const hasKey = manager.hasTranslation('biota.definition');
console.log(`Has 'biota.definition': ${hasKey}`);

// Add a new translation
manager.addTranslation('biota.new_key', 'New Value', 'en');
manager.addTranslation('biota.new_key', 'Nouvelle Valeur', 'fr');

// Delete a translation
manager.deleteTranslation('biota.no_entry');

// Regenerate files
manager.regenerateTranslationFiles();

// Check if a key exists in all locales
const keyCheck = manager.isKeyInAllLocales('biota.definition');
console.log(`'biota.definition' exists in all locales: ${keyCheck.exists}`);
if (!keyCheck.exists) {
  console.log(`Missing in locales: ${keyCheck.missingLocales.join(', ')}`);
}

// Check if all locales have the same number of keys
const countCheck = manager.hasConsistentKeyCount();
console.log(`Consistent key count: ${countCheck.consistent}`);
console.log('Counts by locale:', countCheck.countsByLocale);

// Get all missing translation keys
const missingKeys = manager.getMissingTranslationKeys();
console.log('Missing keys by locale:', missingKeys);
*/

