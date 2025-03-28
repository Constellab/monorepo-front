import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'glob';

/**
 * Generates a public-api.ts file for a given folder that exports all TypeScript files
 *
 * @param folderPath - Path to the folder where public-api.ts will be created
 * @param generateIndex - When true, also generates an index.ts file that exports from public-api.ts
 * @returns Path to the created public-api.ts file or an object with paths when index is also generated, or null if no files were found
 */
export async function generatePublicApi(
  folderPath: string,
  generateIndex: boolean = false
): Promise<string | { publicApiPath: string; indexPath: string | null } | null> {
  try {
    const absolutePath = path.resolve(folderPath);
    const publicApiPath = path.join(absolutePath, 'public-api.ts');
    const indexPath = path.join(absolutePath, 'index.ts');

    console.log(`Generating public API for: ${absolutePath}`);

    // Delete existing public-api.ts if it exists
    try {
      await fs.unlink(publicApiPath);
      console.log(`Deleted existing public-api.ts`);
    } catch (error) {
      // File probably doesn't exist, which is fine
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error(`Error deleting existing public-api.ts:`, error);
      }
    }

    // Delete existing index.ts if generateIndex is true
    if (generateIndex) {
      try {
        await fs.unlink(indexPath);
        console.log(`Deleted existing index.ts`);
      } catch (error) {
        // File probably doesn't exist, which is fine
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          console.error(`Error deleting existing index.ts:`, error);
        }
      }
    }

    // Find all TypeScript files in the folder
    const files: string[] = await new Promise((resolve, reject) => {
      glob('**/*.ts', { cwd: absolutePath, ignore: ['public-api.ts', 'index.ts'] }, (err, files) => {
        if (err) reject(err);
        else resolve(files);
      });
    });

    if (files.length === 0) {
      console.log(`No TypeScript files found in ${absolutePath}`);
      return null;
    }

    console.log(`Found ${files.length} TypeScript files to export`);

    // Generate export statements
    const exportStatements = files
      .map(file => {
        // Convert Windows paths to POSIX and remove extension
        const normalizedPath = file.replace(/\\/g, '/').replace(/\.ts$/, '');
        // Skip test files, spec files, index.ts files and .d.ts files
        if (
          normalizedPath.includes('.spec') ||
          normalizedPath.includes('.test') ||
          normalizedPath.endsWith('.d') ||
          normalizedPath === 'index' ||
          normalizedPath.endsWith('/index')
        ) {
          return null;
        }
        return `export * from './${normalizedPath}';`;
      })
      .filter(Boolean); // Filter out null values

    // Create public-api.ts content
    const content = `/**
 * Generated Public API
 * Exports all TypeScript files from ${path.basename(absolutePath)}
 */

${exportStatements.join('\n')}
`;

    // Write public-api.ts
    await fs.writeFile(publicApiPath, content, 'utf8');
    console.log(`Generated public-api.ts at ${publicApiPath}`);

    // Generate index.ts if requested
    let indexPathResult: string | null = null;
    if (generateIndex) {
      const indexContent = `/**
 * Generated Index File
 * Re-exports everything from public-api.ts
 */

export * from './public-api';
`;
      await fs.writeFile(indexPath, indexContent, 'utf8');
      console.log(`Generated index.ts at ${indexPath}`);
      indexPathResult = indexPath;
    }

    // Return appropriate result based on generateIndex flag
    if (generateIndex) {
      return {
        publicApiPath,
        indexPath: indexPathResult
      };
    }

    return publicApiPath;
  } catch (error) {
    console.error(`Error generating public API:`, error);
    throw error;
  }
}
