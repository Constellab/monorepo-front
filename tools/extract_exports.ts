import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as ts from 'typescript';

/**
 * Represents an exported declaration
 */
interface ExportedDeclaration {
  type: string;
  name: string;
  originalName?: string;
  declaration: string;
}

/**
 * Represents the result of analyzing exports in a file
 */
interface FileAnalysisResult {
  filePath: string;
  exports: ExportedDeclaration[];
  count: number;
  error?: string;
}

/**
 * Represents aggregated statistics about exports
 */
interface ExportStats {
  filesProcessed: number;
  totalExports: number;
  exportsByType: Record<string, number>;
}

/**
 * Represents the complete project analysis results
 */
interface ProjectAnalysisResult {
  results: FileAnalysisResult[];
  stats: ExportStats;
}

/**
 * Extracts all exported declarations from a TypeScript/JavaScript file
 * using the TypeScript Compiler API
 * @param filePath - Path to the file to analyze
 * @returns Information about exports in the file
 */
function extractExportedDeclarations(filePath: string): FileAnalysisResult {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const exports: ExportedDeclaration[] = [];
    
    // Create a SourceFile object
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );
    
    // Visit each node in the source file
    function visit(node: ts.Node) {
      // Check export modifiers
      if (ts.isExportDeclaration(node)) {
        // Handle "export { x, y }" and "export { x as y }" style exports
        if (node.exportClause && ts.isNamedExports(node.exportClause)) {
          node.exportClause.elements.forEach(element => {
            exports.push({
              type: 'named export',
              name: element.name.text,
              originalName: element.propertyName?.text,
              declaration: element.getText()
            });
          });
        }
      } else if (ts.isClassDeclaration(node) && hasExportModifier(node)) {
        // Export class
        if (node.name) {
          exports.push({
            type: 'class',
            name: node.name.text,
            declaration: node.getText().split(/\r?\n/)[0] // Get the first line of declaration
          });
        }
      } else if (ts.isInterfaceDeclaration(node) && hasExportModifier(node)) {
        // Export interface
        exports.push({
          type: 'interface',
          name: node.name.text,
          declaration: node.getText().split(/\r?\n/)[0]
        });
      } else if (ts.isTypeAliasDeclaration(node) && hasExportModifier(node)) {
        // Export type
        exports.push({
          type: 'type',
          name: node.name.text,
          declaration: node.getText().split(/\r?\n/)[0]
        });
      } else if (ts.isEnumDeclaration(node) && hasExportModifier(node)) {
        // Export enum
        exports.push({
          type: 'enum',
          name: node.name.text,
          declaration: node.getText().split(/\r?\n/)[0]
        });
      } else if (ts.isFunctionDeclaration(node) && hasExportModifier(node)) {
        // Export function
        if (node.name) {
          exports.push({
            type: 'function',
            name: node.name.text,
            declaration: node.getText().split(/\r?\n/)[0]
          });
        }
      } else if (ts.isVariableStatement(node) && hasExportModifier(node)) {
        // Export variables (const, let, var)
        node.declarationList.declarations.forEach(declaration => {
          if (ts.isIdentifier(declaration.name)) {
            const variableType = getVariableType(node);
            exports.push({
              type: variableType,
              name: declaration.name.text,
              declaration: `export ${variableType} ${declaration.name.text}`
            });
          }
        });
      } else if (isExportDefault(node)) {
        // Export default
        let name = 'default';
        
        if (ts.isIdentifier(node.expression)) {
          name = node.expression.text;
        } else if (ts.isClassExpression(node.expression) && node.expression.name) {
          name = node.expression.name.text;
        } else if (ts.isFunctionExpression(node.expression) && node.expression.name) {
          name = node.expression.name.text;
        }
        
        exports.push({
          type: 'default export',
          name: name,
          declaration: `export default ${name}`
        });
      }
      
      // Continue visiting child nodes
      ts.forEachChild(node, visit);
    }
    
    // Check if a node has the export modifier
    function hasExportModifier(node: ts.Declaration): boolean {
      return node.modifiers !== undefined && 
        node.modifiers.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword);
    }
    
    // Identify if a node is an export default declaration
    function isExportDefault(node: ts.Node): node is ts.ExportAssignment {
      return ts.isExportAssignment(node) && node.isExportEquals === false;
    }
    
    // Get the variable type (const, let, var)
    function getVariableType(node: ts.VariableStatement): string {
      const flags = node.declarationList.flags;
      if (flags & ts.NodeFlags.Const) return 'const';
      if (flags & ts.NodeFlags.Let) return 'let';
      return 'var';
    }
    
    // Start visiting from the root node
    visit(sourceFile);
    
    return {
      filePath,
      exports,
      count: exports.length
    };
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return {
      filePath,
      exports: [],
      count: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Extracts exported declarations from multiple files matching a pattern
 * @param projectDir - Root directory to search in
 * @param filePattern - Glob pattern for files to process
 * @returns Information about exports from all matching files
 */
function extractExportsFromProject(
  projectDir: string, 
  filePattern = "**/*.{ts,tsx}"
): ProjectAnalysisResult {
  // Find all files matching the pattern
  const files = glob.sync(path.join(projectDir, filePattern));
  console.log(`Found ${files.length} files to analyze for exports`);

  const results = files.map(filePath => extractExportedDeclarations(filePath));

  // Aggregate statistics
  const stats: ExportStats = {
    filesProcessed: files.length,
    totalExports: results.reduce((sum, result) => sum + result.count, 0),
    exportsByType: {}
  };

  // Count exports by type
  results.forEach(result => {
    result.exports.forEach(exp => {
      if (!stats.exportsByType[exp.type]) {
        stats.exportsByType[exp.type] = 0;
      }
      stats.exportsByType[exp.type]++;
    });
  });

  return {
    results,
    stats
  };
}

export {
  extractExportedDeclarations,
  extractExportsFromProject,
  ExportedDeclaration,
  FileAnalysisResult,
  ExportStats,
  ProjectAnalysisResult
};
