import * as path from 'path';
import * as fs from 'fs';
import * as ts from 'typescript';
import { extractTranslationStrings } from './string-extractor';
import { TranslationManager } from './translation-manager';

export interface MigrationOptions {
  /** Target filename for merged translations (e.g., 'merged-.json') */
  targetFile?: string;
  /** Parent key to prefix all translations (e.g., 'li' will place all translations under this key) */
  parentKey?: string;
}

export class TranslationMigrator {
  private originManager: TranslationManager;
  private newManager: TranslationManager;
  private filesToMigratePath: string;
  private options: MigrationOptions;

  /**
   * Creates a new TranslationMigrator
   * @param originTranslationPath Path to the original translation folder
   * @param newTranslationPath Path to the new translation folder
   * @param filesToMigratePath Path to the folder containing files to extract strings from
   * @param options Optional configuration for the migration process
   */
  constructor(
    originTranslationPath: string,
    newTranslationPath: string,
    filesToMigratePath: string,
    options: MigrationOptions = {}
  ) {
    this.originManager = new TranslationManager(originTranslationPath);
    this.newManager = new TranslationManager(newTranslationPath);
    this.filesToMigratePath = filesToMigratePath;
    this.options = options;
  }

  /**
   * Determines the target filename for a translation
   * @param originalFile The original filename
   * @param locale The locale code
   * @returns The target filename
   */
  private getTargetFilename(originalFile: string, locale: string): string {
    if (this.options.targetFile) {
      // Check if the target file includes the locale code
      if (this.options.targetFile.includes('-' + locale)) {
        return this.options.targetFile;
      }

      // Extract the base name without extension
      const baseName = this.options.targetFile.replace(/\.json$/, '');
      // If locale is not in the filename, append it
      if (!baseName.endsWith('-' + locale)) {
        return `${baseName}-${locale}.json`;
      }
      return this.options.targetFile;
    }

    // Default: use the original filename
    return originalFile;
  }

  /**
   * Applies the parent key prefix if configured
   * @param key The original translation key
   * @returns The prefixed key
   */
  private applyParentKeyPrefix(key: string): string {
    if (this.options.parentKey) {
      // Extract the last part of the key to flatten the structure
      const lastKeyPart = key.split('.').pop() || '';
      return `${this.options.parentKey}.${lastKeyPart}`;
    }
    return key;
  }

  /**
   * Migrates translations from the origin to the new folder
   * based on strings extracted from the files to migrate
   */
  public migrate(): void {
    console.log(`Starting translation migration process...`);
    console.log(`Extracting strings from: ${this.filesToMigratePath}`);

    // Extract strings from the files to migrate
    const extractionResults = extractTranslationStrings(this.filesToMigratePath);

    console.log(`Found ${extractionResults.length} files with translation strings`);

    // Track statistics for reporting
    let totalStrings = 0;
    let migratedCount = 0;
    let skippedCount = 0;

    // Process each file's extraction results
    for (const fileResult of extractionResults) {
      totalStrings += fileResult.strings.length;

      // Create mapping for this file
      const fileKeyMap = new Map<string, string>();

      // Process each string in the file
      for (const string of fileResult.strings) {
        // Skip if translation already exists in new manager
        if (this.newManager.hasTranslation(string)) {
          skippedCount++;
          continue;
        }

        if (this.originManager.hasTranslation(string)) {
          // Get all translations for this string in all locales
          const translations = this.originManager.getTranslationAllLocales(string);

          // Add each translation to the new manager
          for (const translation of translations) {
            const { key, value, locale, originFile } = translation;

            // Determine the new origin file
            const targetFile = this.getTargetFilename(path.basename(originFile), locale);

            // Apply parent key prefix if configured
            const targetKey = this.applyParentKeyPrefix(key);

            // Store the key mapping
            fileKeyMap.set(key, targetKey);

            this.newManager.addTranslation(targetKey, value as string, locale, targetFile);
          }

          migratedCount++;
        }
      }

      // Rewrite the file with new keys
      this.rewriteFileWithNewKeys(fileResult.path, fileKeyMap);
    }

    console.log(`Total strings processed: ${totalStrings}`);
    console.log(`Migrated ${migratedCount} translation keys`);
    console.log(`Skipped ${skippedCount} already existing translations`);

    // Log migration options used
    if (this.options.targetFile) {
      console.log(`Target file: ${this.options.targetFile}`);
    }
    if (this.options.parentKey) {
      console.log(`Applied parent key prefix: '${this.options.parentKey}'`);
    }

    // Regenerate both sets of translation files
    console.log('Regenerating translation files...');
    this.originManager.regenerateTranslationFiles();
    this.newManager.regenerateTranslationFiles();

    console.log('Migration completed successfully');
  }

  /**
   * Rewrites a source file to replace old translation keys with new ones
   * @param filePath Path to the file to be rewritten
   * @param keyMap Mapping of old keys to new keys
   */
  private rewriteFileWithNewKeys(filePath: string, keyMap: Map<string, string>): void {
    if (!keyMap || keyMap.size === 0) {
      return;
    }

    try {
      // Only process TypeScript and HTML files
      if (!filePath.endsWith('.ts') && !filePath.endsWith('.html')) {
        return;
      }

      // Read the file content
      const content = fs.readFileSync(filePath, 'utf8');
      let updatedContent = content;

      // Process each key separately based on whether it contains a dot
      keyMap.forEach((newKey, oldKey) => {
        if (oldKey.includes('.')) {
          // For keys with dots: simple string replacement
          const regex = new RegExp(`'${oldKey}'|"${oldKey}"`, 'g');
          let replacementCount = 0;

          updatedContent = updatedContent.replace(regex, (match) => {
            replacementCount++;
            // Preserve the quote style (single or double)
            return match.charAt(0) + newKey + match.charAt(0);
          });

        } else {

          // if file is HTML, use HTML regex
          if (filePath.endsWith('.html')) {
            updatedContent = this.replaceInHTML(oldKey, newKey, updatedContent);
          } else {
            // For keys without dots: use TypeScript compiler to find { text: 'oldKey' } patterns
            updatedContent = this.replaceInTypescript(oldKey, newKey, updatedContent, filePath);
          }
        }
      });

      // Write the updated content back to the file if changes were made
      if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
      }
    } catch (error) {
      console.error(`Error rewriting file ${filePath}:`, error);
    }
  }

  private replaceInHTML(oldKey: string, newKey: string, content: string):  string {
    // In TypeScript files: Find only 'oldKey' | translate or "oldKey" | translate patterns
    const singleQuoteRegex = new RegExp(`'${oldKey}'\\s*\\|\\s*translate`, 'g');
    const doubleQuoteRegex = new RegExp(`"${oldKey}"\\s*\\|\\s*translate`, 'g');

    // Replace with new keys but keep pipe and translate
    content = content.replace(singleQuoteRegex, `'${newKey}' | translate`);
    content = content.replace(doubleQuoteRegex, `"${newKey}" | translate`);

    return content;
  }

  private replaceInTypescript(oldKey: string, newKey: string, content: string, filePath: string): string {
    // For keys without dots: use TypeScript compiler to find { text: 'oldKey' } patterns
    const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

    const replacements: { pos: number; end: number; text: string }[] = [];

    // Find all string literals in the file
    const findStringLiterals = (node: ts.Node) => {
      // Check if this is a string literal with our target value
      if (
        ts.isStringLiteral(node) &&
        (node.text === oldKey ||
          node.getText(sourceFile) === `'${oldKey}'` ||
          node.getText(sourceFile) === `"${oldKey}"`)
      ) {
        // Check if this string is part of a property assignment with 'text' property
        const parent = node.parent;
        if (ts.isPropertyAssignment(parent)) {
          const propertyName = parent.name;
          if (
            (ts.isIdentifier(propertyName) && propertyName.text === 'text') ||
            (ts.isStringLiteral(propertyName) && propertyName.text === 'text')
          ) {
            // We found { text: 'oldKey' } pattern
            const start = node.getStart(sourceFile);
            const end = node.getEnd();
            const quote = node.getText(sourceFile).charAt(0); // Get the quote style used
            replacements.push({
              pos: start,
              end: end,
              text: `${quote}${newKey}${quote}`,
            });
          }
        }
      }

      // Recurse into children
      ts.forEachChild(node, findStringLiterals);
    };

    findStringLiterals(sourceFile);

    // Apply replacements in reverse order to avoid position shifting
    if (replacements.length > 0) {
      let result = content;
      replacements
        .sort((a, b) => b.pos - a.pos) // Sort in reverse order
        .forEach(({ pos, end, text }) => {
          result = result.substring(0, pos) + text + result.substring(end);
        });

      content = result;
    }

    return content;
  }
}

// Example usage:
/*
const migrator = new TranslationMigrator(
  'c:/Users/benji/Documents/Projects/Gencovery/monorepo-front/apps/lab-front/src/assets/i18n',
  'c:/Users/benji/Documents/Projects/Gencovery/monorepo-front/apps/new-app/src/assets/i18n',
  'c:/Users/benji/Documents/Projects/Gencovery/monorepo-front/apps/new-app/src',
  {
    targetFile: 'merged.json',     // Merge all translations into single files per locale (e.g., merged-en.json)
    parentKey: 'li'                // Place all translations under 'li' key
  }
);

migrator.migrate();

*/
