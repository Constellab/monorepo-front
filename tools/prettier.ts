import { execSync } from 'child_process';
/**
 * Runs Prettier on a file
 * @param path - Path to the file or folder to format
 * @returns true if formatting was successful, false otherwise
 */
export function runPrettier(path: string): boolean {
  try {
    execSync(`npx prettier "${path}" --write`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(`Error running Prettier on ${path}:`, error);
    return false;
  }
}
