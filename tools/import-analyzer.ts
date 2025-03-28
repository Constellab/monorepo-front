import * as fs from 'fs';
import * as ts from 'typescript';

/**
 * Represents an imported item with its name and optional alias
 */
export interface ImportedItem {
  name: string;
  alias: string | null;
}

/**
 * Represents a detected import statement
 */
export interface ImportDeclaration {
  type: 'named' | 'default' | 'namespace';
  source: string;
  items: ImportedItem[];
  statement: string;
}

/**
 * Result of the import extraction process
 */
export interface ImportAnalysisResult {
  filePath: string;
  imports: ImportDeclaration[];
  count: number;
  error?: string;
}

/**
 * Extracts all import declarations from a TypeScript/JavaScript file
 * Uses TypeScript Compiler API for accurate parsing
 * @param filePath - Path to the file to analyze
 * @returns Analysis result containing import details
 */
export function extractImportDeclarations(filePath: string): ImportAnalysisResult {
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    const imports: ImportDeclaration[] = [];

    // Create a SourceFile object
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );

    // Visit each node in the source file
    ts.forEachChild(sourceFile, node => {
      if (ts.isImportDeclaration(node)) {
        // Get the import source path
        const source = node.moduleSpecifier.getText(sourceFile);
        // Remove quotes from the source path
        const sourcePath = source.substring(1, source.length - 1);

        const importedItems: ImportedItem[] = [];
        let importType: 'named' | 'default' | 'namespace' = 'named';

        // Extract the imported items
        if (node.importClause) {
          // Handle named imports
          if (node.importClause.namedBindings) {
            const namedBindings = node.importClause.namedBindings;

            if (ts.isNamedImports(namedBindings)) {
              // Process named imports like: import { A, B as C } from 'module'
              namedBindings.elements.forEach(element => {
                importedItems.push({
                  name: element.propertyName ? element.propertyName.text : element.name.text,
                  alias: element.propertyName ? element.name.text : null
                });
              });
            } else if (ts.isNamespaceImport(namedBindings)) {
              // Process namespace imports like: import * as D from 'module'
              importType = 'namespace';
              importedItems.push({
                name: '*',
                alias: namedBindings.name.text
              });
            }
          }

          // Handle default imports
          if (node.importClause.name) {
            importType = 'default';
            importedItems.push({
              name: 'default',
              alias: node.importClause.name.text
            });
          }
        }

        imports.push({
          type: importType,
          source: sourcePath,
          items: importedItems,
          statement: node.getText(sourceFile).trim()
        });
      }
    });

    return {
      filePath,
      imports,
      count: imports.length
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error processing ${filePath}:`, errorMessage);
    return {
      filePath,
      imports: [],
      count: 0,
      error: errorMessage
    };
  }
}
