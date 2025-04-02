import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

export interface StringExtractorFileResult {
  path: string;
  strings: string[];
}

/**
 * Extracts string literals from TypeScript files
 * @param filePath Path to the TypeScript file
 * @returns Array of string literals
 */
function extractStringsFromTS(filePath: string): string[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  const strings: string[] = [];

  function visit(node: ts.Node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const value = node.getText(sourceFile).slice(1, -1); // Remove quotes
      if (value.trim().length > 0) {
        strings.push(value);
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return strings;
}

/**
 * Extracts string literals from HTML files
 * @param filePath Path to the HTML file
 * @returns Array of string literals
 */
function extractStringsFromHTML(filePath: string): string[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const strings: string[] = [];

  // Match all content inside single quotes
  const singleQuoteRegex = /'([^'\\]*(\\.[^'\\]*)*)'/g;
  let singleQuoteMatch: RegExpExecArray | null;

  while ((singleQuoteMatch = singleQuoteRegex.exec(fileContent)) !== null) {
    if (singleQuoteMatch[1].trim().length > 0) {
      strings.push(singleQuoteMatch[1]);
    }
  }

  // Match all content inside double quotes
  const doubleQuoteRegex = /"([^"\\]*(\\.[^"\\]*)*)"/g;
  let doubleQuoteMatch: RegExpExecArray | null;

  while ((doubleQuoteMatch = doubleQuoteRegex.exec(fileContent)) !== null) {
    if (doubleQuoteMatch[1].trim().length > 0) {
      strings.push(doubleQuoteMatch[1]);
    }
  }

  return strings;
}

/**
 * Processes a file and extracts strings based on file type
 * @param filePath Path to the file
 * @returns Object with file path and extracted strings
 */
function processFile(filePath: string): StringExtractorFileResult {
  const ext = path.extname(filePath).toLowerCase();

  let strings: string[] = [];

  if (ext === '.ts' || ext === '.tsx') {
    strings = extractStringsFromTS(filePath);
  } else if (ext === '.html') {
    strings = extractStringsFromHTML(filePath);
  }

  return {
    path: filePath,
    strings
  };
}

/**
 * Processes all files in a directory recursively
 * @param dirPath Directory path to scan
 * @param fileExtensions Array of file extensions to process
 * @returns Array of objects with file paths and their extracted strings
 */
function processDirectory(
  dirPath: string,
  fileExtensions: string[] = ['.ts', '.tsx', '.html']
): Array<{ path: string; strings: string[] }> {
  const results: StringExtractorFileResult[] = [];

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      results.push(...processDirectory(filePath, fileExtensions));
    } else if (fileExtensions.includes(path.extname(filePath).toLowerCase())) {
      results.push(processFile(filePath));
    }
  }

  return results;
}

/**
 * Main function to extract strings from a directory
 * @param dirPath Directory path to scan
 */
export function extractTranslationStrings(
  dirPath: string,
): StringExtractorFileResult[] {
  console.log(`Scanning directory: ${dirPath}`);
  const results = processDirectory(dirPath);

  // Filter out entries with empty strings arrays
  return results.filter((result) => result.strings.length > 0);
}

// Example usage (uncomment to use)
// const projectRoot = 'c:/Users/benji/Documents/Projects/Gencovery/monorepo-front';
// extractTranslationStrings(projectRoot);

