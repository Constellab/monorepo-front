import * as fs from 'fs';
import * as ts from 'typescript';
import { extractImportDeclarations, ImportDeclaration, ImportedItem } from './import-analyzer';
import { deleteImport } from './import-updater';


/**
 * Result of the import merging process
 */
interface ImportMergeResult {
  filePath: string;
  originalImportCount: number;
  mergedImportCount: number;
  mergedSources: string[];
  updatedContent: string;
  success: boolean;
  error?: string;
}

/**
 * Merges multiple import declarations from the same source into a single import
 * Only supports imports in the format "import { A } from 'B'"
 * @param filePath - Path to the file to analyze and update
 * @param writeChanges - Whether to write the changes back to the file (default: true)
 * @returns Result of the merging process
 */
export function mergeImportsFromSameSource(filePath: string, writeChanges: boolean = true): ImportMergeResult {
  console.log(`Processing ${filePath}`);
  try {
    // Get the original file content
    const originalContent = fs.readFileSync(filePath, 'utf8');

    // Extract all imports using the existing function
    const analysisResult = extractImportDeclarations(filePath);

    if (analysisResult.error) {
      return {
        filePath,
        originalImportCount: 0,
        mergedImportCount: 0,
        mergedSources: [],
        updatedContent: originalContent,
        success: false,
        error: analysisResult.error
      };
    }

    // Create an object to store imported items by source
    const namedImportsBySource = new Map<string, Map<string, string | null>>();

    // Track sources that have named imports
    const sourcesWithNamedImports = new Set<string>();

    // Collect all named imports by source
    for (const importDecl of analysisResult.imports) {
      if (importDecl.type === 'named') {
        sourcesWithNamedImports.add(importDecl.source);

        if (!namedImportsBySource.has(importDecl.source)) {
          namedImportsBySource.set(importDecl.source, new Map<string, string | null>());
        }

        const importItemsMap = namedImportsBySource.get(importDecl.source)!;

        // Add each named import item to the map
        for (const item of importDecl.items) {
          importItemsMap.set(item.name, item.alias);
        }
      }
    }

    // Only proceed if we found named imports to merge
    if (namedImportsBySource.size === 0) {
      return {
        filePath,
        originalImportCount: analysisResult.count,
        mergedImportCount: 0,
        mergedSources: [],
        updatedContent: originalContent,
        success: true
      };
    }

    // Create a list of import statements to remove
    const importsToRemove: ImportDeclaration[] = analysisResult.imports.filter(
      importDecl => importDecl.type === 'named' && sourcesWithNamedImports.has(importDecl.source)
    );

    // Sort imports by their position in the file to remove them in reverse order
    const sortedImportsToRemove = [...importsToRemove].sort((a, b) => {
      const posA = originalContent.indexOf(a.statement);
      const posB = originalContent.indexOf(b.statement);
      return posB - posA; // Sort in reverse order
    });

    // Remove all original named imports
    let updatedContent = originalContent;

    for (const importDecl of sortedImportsToRemove) {
      updatedContent = deleteImport(updatedContent, importDecl.statement);
    }

    // Generate new merged import statements
    const mergedImports: string[] = [];
    const mergedSources: string[] = Array.from(namedImportsBySource.keys());

    for (const [source, importsMap] of namedImportsBySource.entries()) {
      // Convert the map to an array of import specifiers
      const importSpecifiers = Array.from(importsMap.entries())
        .map(([name, alias]) => alias ? `${name} as ${alias}` : name)
        .sort() // Sort alphabetically for consistency
        .join(', ');

      // Create the merged import statement
      const mergedImport = `import { ${importSpecifiers} } from '${source}';`;
      mergedImports.push(mergedImport);
    }

    // Sort the merged imports alphabetically by source
    mergedImports.sort();

    // Add the merged imports at the beginning of the file
    updatedContent = mergedImports.join('\n') + '\n\n' + updatedContent;

    // Save the updated content back to the file if requested
    if (writeChanges) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Successfully merged imports in ${filePath}`);
      console.log(`   Merged ${mergedSources.length} sources: ${mergedSources.join(', ')}`);
    } else {
      console.log(`ℹ️ Changes were not written to disk (dry run)`);
    }

    return {
      filePath,
      originalImportCount: analysisResult.count,
      mergedImportCount: namedImportsBySource.size,
      mergedSources,
      updatedContent,
      success: true
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error merging imports in ${filePath}:`, errorMessage);
    return {
      filePath,
      originalImportCount: 0,
      mergedImportCount: 0,
      mergedSources: [],
      updatedContent: fs.readFileSync(filePath, 'utf8'),
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Command-line utility function to merge imports in a file
 * @param filePath - Path to the file to process
 */
export function runImportMerger(filePath: string): void {
  console.log(`\n🔄 Processing file: ${filePath}`);
  const result = mergeImportsFromSameSource(filePath, true);

  if (result.success) {
    if (result.mergedSources.length > 0) {
      console.log(`✅ Successfully merged imports from ${result.mergedSources.length} sources in ${filePath}`);
      console.log(`   Original import count: ${result.originalImportCount}`);
      console.log(`   Merged sources: ${result.mergedSources.join(', ')}`);
    } else {
      console.log(`ℹ️ No named imports to merge in ${filePath}`);
    }
  } else {
    console.error(`❌ Failed to process ${filePath}: ${result.error}`);
  }
}

// Add this line to allow running the script directly
if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Please provide a file path as an argument');
    process.exit(1);
  }
  runImportMerger(filePath);
}
