import fs from 'fs';
import path from 'path';
import glob from 'glob';

interface ReplacementResult {
  filePath: string;
  replaced: boolean;
  occurrences: number;
  error?: string;
}

interface FolderReplacementStats {
  filesProcessed: number;
  filesModified: number;
  totalOccurrences: number;
}

interface FolderReplacementResult {
  results: ReplacementResult[];
  stats: FolderReplacementStats;
}

/**
 * Replaces an exact word with another word in a file
 * @param {string} filePath - Path to the file
 * @param {string} oldWord - The exact word to replace
 * @param {string} newWord - The new word to replace with
 * @returns {ReplacementResult} Information about the replacement
 */
function replaceExactWordInFile(filePath: string, oldWord: string, newWord: string): ReplacementResult {
  try {
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');

    // Create a regex that matches the exact word with word boundaries
    const exactWordRegex = new RegExp(`\\b${oldWord}\\b`, 'g');

    // Count occurrences
    const matches = content.match(exactWordRegex);
    const occurrences = matches ? matches.length : 0;

    if (occurrences === 0) {
      return {
        filePath,
        replaced: false,
        occurrences: 0
      };
    }

    // Replace all occurrences
    const newContent = content.replace(exactWordRegex, newWord);

    // Write updated content back to file
    fs.writeFileSync(filePath, newContent, 'utf8');

    return {
      filePath,
      replaced: true,
      occurrences
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return {
      filePath,
      replaced: false,
      occurrences: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Replaces an exact word with another word in all files in a folder
 * @param {string} folderPath - Path to the folder
 * @param {string} oldWord - The exact word to replace
 * @param {string} newWord - The new word to replace with
 * @param {string} filePattern - Glob pattern for files to process
 * @returns {FolderReplacementResult} Information about the replacements
 */
function replaceExactWordInFolder(
  folderPath: string, 
  oldWord: string, 
  newWord: string, 
  filePattern: string = "**/*.{ts,tsx,js,jsx}"
): FolderReplacementResult {
  // Find all files matching the pattern
  const files = glob.sync(path.join(folderPath, filePattern));
  console.log(`Found ${files.length} files to process for word replacement`);

  const results = files.map(filePath => replaceExactWordInFile(filePath, oldWord, newWord));

  // Aggregate statistics
  const stats: FolderReplacementStats = {
    filesProcessed: files.length,
    filesModified: results.filter(r => r.replaced).length,
    totalOccurrences: results.reduce((sum, result) => sum + result.occurrences, 0)
  };

  return {
    results,
    stats
  };
}

// These functions are referenced in exports but not defined in the original code
// Providing empty placeholder implementations to avoid TypeScript errors
function extractExportedDeclarations(filePath: string): any {
  // Implementation needed
  throw new Error("Function not implemented");
}

function extractExportsFromProject(projectPath: string): any {
  // Implementation needed
  throw new Error("Function not implemented");
}

export {
  extractExportedDeclarations,
  extractExportsFromProject,
  replaceExactWordInFile,
  replaceExactWordInFolder
};
