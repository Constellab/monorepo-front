import * as path from 'path';
import * as glob from 'glob';
import * as fs from 'fs';
import { extractExportsFromProject, ProjectAnalysisResult } from './extract_exports';
import { extractImportDeclarations, ImportedItem } from './import-analyzer';
import { addImport, deleteImport, getAppropriateImportPath, loadPathAliases } from './import-updater';
import { mergeImportsFromSameSource } from './import-merger';
import { runPrettier } from './prettier';

/**
 * Map of export names to their source files
 */
interface ExportMap {
  [exportName: string]: string;
}

/**
 * Results from the import fixing operation
 */
interface ImportFixResults {
  totalFiles: number;
  processedFiles: number;
  updatedFiles: number;
  errors: Array<{ file: string; error: string }>;
}

/**
 * Fixes all imports in a file by rewriting them with proper paths
 * Only supports named imports in the format: import { A } from 'B'
 * @param filePath - The path of the file to fix imports in
 * @param exportMap - Map of export names to their source files
 * @returns Whether the file was updated
 */
export function fixImportsInFile(filePath: string, exportMap: ExportMap): boolean {
  try {
    // Read the original file content
    let fileContent = fs.readFileSync(filePath, 'utf8');
    const originalContent = fileContent;

    // Extract imports from the file
    const importAnalysis = extractImportDeclarations(filePath);
    if (importAnalysis.error) {
      throw new Error(importAnalysis.error);
    }

    // Load path aliases for resolving import paths
    const pathAliases = loadPathAliases();

    // Process each import declaration
    for (const importDecl of importAnalysis.imports) {
      // Only process relative imports or monorepo imports
      if (!importDecl.source.startsWith('.') && !importDecl.source.startsWith('@monorepo')) {
        continue;
      }

      // Skip non-named imports (default or namespace imports)
      if (importDecl.type !== 'named' || importDecl.items.length === 0) {
        continue;
      }

      // Remove the original import
      fileContent = deleteImport(fileContent, importDecl.statement);

      // Group items by their correct source
      const importsBySource: { [source: string]: ImportedItem[] } = {};

      // Process each imported item
      for (const item of importDecl.items) {
        const itemName = item.name;
        let targetSource: string;

        // If the item exists in our export map, use that source
        if (exportMap[itemName]) {
          targetSource = exportMap[itemName];
        } else {
          // Otherwise use the original source
          targetSource = importDecl.source;
        }

        // Get appropriate import path (aliased or relative)
        const resolvedSource = getAppropriateImportPath(filePath, targetSource, pathAliases);

        // Initialize array for this source if needed
        if (!importsBySource[resolvedSource]) {
          importsBySource[resolvedSource] = [];
        }

        // Add this item to the appropriate source group
        importsBySource[resolvedSource].push(item);
      }

      // Create new import statements for each source
      for (const [source, items] of Object.entries(importsBySource)) {
        if (items.length === 0) continue;

        // Create a simple named import statement
        let newImport = 'import { ';
        newImport += items
          .map((item) => {
            if (item.alias) {
              return `${item.name} as ${item.alias}`;
            } else {
              return item.name;
            }
          })
          .join(', ');
        newImport += ` } from '${source}';`;

        // Add the new import to the file
        fileContent = addImport(fileContent, newImport);
      }
    }

    // If the content has changed, write it back to the file
    if (fileContent !== originalContent) {
      fs.writeFileSync(filePath, fileContent, 'utf8');
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error fixing imports in ${filePath}:`, error);
    throw error;
  }
}

/**
 * Fixes imports in a folder based on export mapping and alias paths
 * @param sourceFolderAbsPath - The folder to scan and fix imports
 * @param folderToExtractExportsAbsPath - The folder to extract exports from (default is the same as sourceFolder)
 * @param filePattern - Glob pattern for files to process
 * @returns Results of the import fixing operation
 */
export function fixImportsInFolder(
  sourceFolderAbsPath: string,
  folderToExtractExportsAbsPath: string = sourceFolderAbsPath,
  filePattern = '**/*.{ts,tsx}'
): ImportFixResults {
  console.log(`Extract objects from: ${folderToExtractExportsAbsPath}`);
  // Build export map
  console.log('Building export map...');
  const exportData = extractExportsFromProject(folderToExtractExportsAbsPath, filePattern);
  const exportMap = buildExportMap(exportData);
  console.log(`Found ${Object.keys(exportMap).length} exported objects`);

  console.log(`Fix imports in folder: ${sourceFolderAbsPath}`);
  // Get all files to process
  const files = glob.sync(path.join(sourceFolderAbsPath, filePattern));
  console.log(`Found ${files.length} files to process for import fixing`);

  // Results tracking
  const results: ImportFixResults = {
    totalFiles: files.length,
    processedFiles: 0,
    updatedFiles: 0,
    errors: [],
  };

  // Process each file
  for (const file of files) {
    try {
      // Use the new function to fix imports in the file
      const fileUpdated = fixImportsInFile(file, exportMap);

      results.processedFiles++;
      if (fileUpdated) {
        // Merge imports from the same source for cleaner code
        mergeImportsFromSameSource(file);

        results.updatedFiles++;
        console.log(`Updated imports in ${path.relative(sourceFolderAbsPath, file)}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      results.errors.push({ file, error: errorMessage });
      console.error(`Error processing ${file}: ${errorMessage}`);
    }
  }

  console.log('Run prettier on all files');
  runPrettier(sourceFolderAbsPath);

  // Final report
  console.log(
    `Import fixing completed: ${results.updatedFiles} files updated, ${results.errors.length} errors`
  );
  return results;
}

/**
 * Builds a map of export names to their source files
 * @param exportData - Project export analysis results
 * @returns Map of export names to source files
 */
function buildExportMap(exportData: ProjectAnalysisResult): ExportMap {
  const exportMap: ExportMap = {};

  exportData.results.forEach((fileResult) => {
    const relativePath = fileResult.filePath;

    fileResult.exports.forEach((exp) => {
      exportMap[exp.name] = relativePath;
    });
  });

  return exportMap;
}
