import * as fs from 'fs';
import * as path from 'path';

interface PathAliases {
  [key: string]: string[];
}

/**
 * Loads path aliases from tsconfig.base.json
 * @returns Map of path aliases or null if not found
 */
export function loadPathAliases(): PathAliases | null {
  try {
    // Try to find tsconfig.base.json by traversing up directories
    const tsconfigPath: string = path.join(__dirname, '../tsconfig.base.json');

    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    return tsconfig.compilerOptions?.paths || null;
  } catch (error) {
    console.error('Error loading tsconfig.base.json:', error);
    return null;
  }
}

/**
 * Checks if a path is within an aliased directory
 * @param absolutePath - Absolute path to check
 * @param aliases - Path aliases from tsconfig
 * @returns The matching alias and its path, or null if not found
 */
function findMatchingAlias(
  absolutePath: string,
  aliases: PathAliases | null
): {
  alias: string;
  path: string;
} | null {
  if (!aliases) return null;

  // Normalize the path and convert to forward slashes for consistent comparison
  const normalizedPath = absolutePath.replace(/\\/g, '/');

  for (const [alias, paths] of Object.entries(aliases)) {
    const aliasPath = Array.isArray(paths) ? paths[0] : paths;
    if (!aliasPath) continue;

    // Remove trailing wildcards and get base directory path
    const basePath = aliasPath.replace(/\/\*$/, '').replace(/\/index\.ts$/, '');

    // Check if the path is inside this alias's directory
    // Make basePath absolute by joining with the project root
    const projectRoot = path.join(__dirname, '..');
    const absoluteBasePath = path.normalize(path.join(projectRoot, basePath));

    // Convert absoluteBasePath to use forward slashes for consistent comparison
    const normalizedBasePath = absoluteBasePath.replace(/\\/g, '/');

    if (normalizedPath.startsWith(normalizedBasePath)) {
      return { alias, path: basePath };
    }
  }

  return null;
}

/**
 * Converts an absolute path to an aliased import path if possible
 * @param absolutePath - The absolute path to convert
 * @param aliases - Path aliases from tsconfig
 * @returns The aliased path or null if no alias matches
 */
function convertToAliasPath(absolutePath: string, aliases: PathAliases | null): string | null {
  const matchingAlias = findMatchingAlias(absolutePath, aliases);
  if (!matchingAlias) return null;

  const { alias, path: aliasPath } = matchingAlias;
  const projectRoot = path.join(__dirname, '..');
  const absoluteAliasPath = path.normalize(path.join(projectRoot, aliasPath));

  // Get the relative path from the alias base to the target file
  const relativePath = path.relative(absoluteAliasPath, absolutePath);

  // Remove file extension if present
  const withoutExtension = relativePath.replace(/\.(ts|tsx|js|jsx)$/, '');

  // If the path points directly to the aliased entry point or is index file
  if (withoutExtension === '' || withoutExtension === 'index') {
    return alias; // Return just the alias with no subpath
  }

  // Create the alias import path
  // Don't append subfolders - if the alias itself is what we need, just return it
  return alias;
}

/**
 * Calculates a relative path from one file to another
 * @param fromPath - Path of the file containing the import
 * @param toPath - Path of the file being imported
 * @returns Properly formatted relative path for import statement
 */
function calculateRelativePath(fromPath: string, toPath: string): string {
  const fromDir = path.dirname(fromPath);
  let relativePath = path.relative(fromDir, toPath);

  // Remove file extension if present
  relativePath = relativePath.replace(/\.(ts|tsx|js|jsx)$/, '');

  // Make sure it starts with ./ or ../ for relative imports
  if (!relativePath.startsWith('.')) {
    relativePath = `./${relativePath}`;
  }

  // Convert Windows backslashes to forward slashes for import statements
  relativePath = relativePath.replace(/\\/g, '/');

  return relativePath;
}

/**
 * Gets the appropriate import path (aliased or relative) for a source file
 * @param filePath - Path of the file containing the import
 * @param sourcePath - Path of the file being imported
 * @param pathAliases - Path aliases from tsconfig
 * @returns Properly formatted path for import statement
 */
export function getAppropriateImportPath(
  filePath: string,
  sourcePath: string,
  pathAliases: PathAliases | null
): string {
  // Determine if sourcePath is already an alias path
  if (sourcePath.startsWith('@')) {
    return sourcePath;
  }

  // Normalize paths to absolute paths
  const absoluteFilePath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
  const absoluteSourcePath = path.isAbsolute(sourcePath) ? sourcePath : path.resolve(sourcePath);

  // Check if the source file is under an aliased directory
  const sourceAlias = convertToAliasPath(absoluteSourcePath, pathAliases);

  // Check if the current file is also under an aliased directory
  const fileAlias = findMatchingAlias(absoluteFilePath, pathAliases);

  // Use alias only if:
  // 1. We found a valid alias for the source file
  // 2. The current file is not in the same aliased directory as the source
  if (sourceAlias && (!fileAlias || fileAlias.alias !== sourceAlias)) {
    return sourceAlias;
  } else {
    // No alias found or both files under same alias, use relative path
    return calculateRelativePath(absoluteFilePath, absoluteSourcePath);
  }
}

/**
 * Adds an import statement to the beginning of a file
 * @param fileContent - The content of the file
 * @param importStatement - The import statement to add
 * @returns The updated file content
 */
export function addImport(fileContent: string, importStatement: string): string {
  // Find the last import statement position
  const importRegex = /import\s+.*?['"]\s*;?\s*$/gm;
  let lastImportPos = -1;
  let match;

  while ((match = importRegex.exec(fileContent)) !== null) {
    lastImportPos = match.index + match[0].length;
  }

  if (lastImportPos !== -1) {
    // Add after the last import
    const beforeImports = fileContent.substring(0, lastImportPos);
    const afterImports = fileContent.substring(lastImportPos);
    return beforeImports + '\n' + importStatement + afterImports;
  } else {
    // No imports found, add at the beginning of the file
    return importStatement + '\n' + fileContent;
  }
}

export function deleteImport(fileContent: string, importStatement: string): string {
  let statement = importStatement + '\r\n';
  let importPos = fileContent.indexOf(statement);
  if (importPos === -1) {
    statement = importStatement + '\n';
    importPos = fileContent.indexOf(importStatement);
  }

  if (importPos === -1) {
    statement = importStatement;
    importPos = fileContent.indexOf(importStatement);
  }

  if (importPos === -1) {
    console.error(`❌ Could not find import statement to remove: ${statement}`);
    return fileContent;
  }

  // Remove this import
  return fileContent.substring(0, importPos) + fileContent.substring(importPos + statement.length);
}
