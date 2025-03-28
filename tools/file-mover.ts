import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Moves and renames a file, then updates all import statements that reference it
 * @param sourcePath - Path of the file to move
 * @param destinationPath - Destination path with new name
 * @returns Promise that resolves when the operation is complete
 */
export async function moveFiles(sourcePath: string, destinationPath: string): Promise<void> {
  try {
    // Normalize paths for consistent processing
    sourcePath = path.resolve(sourcePath);
    destinationPath = path.resolve(destinationPath);

    // Ensure the destination directory exists
    const destDir = path.dirname(destinationPath);
    await fs.mkdir(destDir, { recursive: true });

    // Move the file
    console.log(`Moving file from ${sourcePath} to ${destinationPath}`);
    await fs.copyFile(sourcePath, destinationPath);
    await fs.unlink(sourcePath);

    console.log('File moved and successfully');
  } catch (error) {
    console.error('Error moving file or updating imports:', error);
    throw error;
  }
}
