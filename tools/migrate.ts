import * as path from 'path';
import * as fs from 'fs';
import { extractExportsFromProject } from './extract_exports';
import { moveFiles } from './file-mover';
import { replaceExactWordInFolder } from './replace-word';
import { fixImportsInFolder } from './import-fixer';

// Get the directory path of the current file

// Helper function to resolve paths relative to this file
function resolvePathFromScript(relativePath: string): string {
  return path.resolve(__dirname, relativePath);
}

interface ExportItem {
  name: string;
  filePath: string;

  [key: string]: any; // For additional properties that might be in the export items
}

interface ReplaceResult {
  filePath: string;
  replaced: boolean;
  occurrences: number;
}

interface RenameResult {
  stats: {
    filesProcessed: number;
    filesModified: number;
    totalOccurrences: number;
  };
  results: ReplaceResult[];
}

interface Replacement {
  oldName: string;
  newName: string;
  occurrences: number;
}

interface ModifiedFile {
  filePath: string;
  replacements: Replacement[];
}

interface ConsolidatedRenameResult {
  renamedObjects: Record<string, string>;
  modifiedFiles: ModifiedFile[];
  stats: {
    filesProcessed: number;
    filesModified: number;
    objectsRenamed: number;
  };
}

interface MovedFile {
  oldPath: string;
  newPath: string;
  fileName: string;
  newFileName: string;
  associatedFiles?: {
    html?: { oldPath: string; newPath: string };
    scss?: { oldPath: string; newPath: string };
    spec?: { oldPath: string; newPath: string };
  };
}

interface RefactorOptions {
  sourceFolder: string;
  targetFolder: string;
  filePattern: string;
  appFolder: string;
}

interface RefactorResult {
  exports: ExportItem[];
  renamedObjects: Record<string, string>;
  movedFiles: MovedFile[];
  importChanges: {
    appFolder: string;
    movedFiles: MovedFile[];
    allExports: ExportItem[];
  };
}

interface ExportDataResult {
  filePath: string;
  exports: Omit<ExportItem, 'filePath'>[];
}

interface ExportData {
  results: ExportDataResult[];
}

/**
 * Step 1: Extract all named exports from source files
 * @param {string} sourceFolder - The source folder path
 * @param {string} filePattern - The file pattern to match
 * @returns {Array} Array of exports with their file paths
 */
function extractAllExports(sourceFolder: string, filePattern: string): ExportItem[] {
  console.log(`Extracting exports from ${sourceFolder} with pattern ${filePattern}`);
  const exportsData: ExportData = extractExportsFromProject(sourceFolder, filePattern);

  // Flatten the results to get all exports with their file paths
  const allExports: ExportItem[] = [];
  exportsData.results.forEach((result) => {
    if (result.exports && result.exports.length > 0) {
      result.exports.forEach((exp) => {
        allExports.push({
          ...exp,
          filePath: result.filePath,
        } as any);
      });
    }
  });

  console.log(`Found ${allExports.length} exports in ${exportsData.results.length} files`);
  return allExports;
}

/**
 * Step 2: Rename exports from Lab prefix to Li prefix
 * @param {string} sourceFolder - The source folder path
 * @param {string} filePattern - The file pattern to match
 * @param {Array} allExports - Array of all exports to target for renaming
 * @param {string} appFolder - The root folder to search for imports to update
 * @returns {Object} Information about renamed objects
 */
function renameLabToLi(
  sourceFolder: string,
  filePattern: string,
  allExports: ExportItem[],
  appFolder: string
): ConsolidatedRenameResult {
  console.log(`Renaming Lab prefixes to Li in ${sourceFolder}`);

  // Filter exports that start with "Lab"
  const labPrefixedExports = allExports.filter((exp) => exp.name.startsWith('Lab'));
  console.log(`Found ${labPrefixedExports.length} exports with Lab prefix`);

  // Prepare the result object
  const consolidatedResult: ConsolidatedRenameResult = {
    renamedObjects: {},
    modifiedFiles: [],
    stats: {
      filesProcessed: 0,
      filesModified: 0,
      objectsRenamed: 0,
    },
  };

  // First, handle specific Lab prefixed exports that we've identified
  for (const exportItem of labPrefixedExports) {
    const oldName = exportItem.name;
    const newName = 'Li' + oldName.substring(3); // Replace Lab with Li

    console.log(`Renaming ${oldName} to ${newName}`);

    const renameResult: RenameResult = replaceExactWordInFolder(appFolder, oldName, newName, filePattern);

    // Add to consolidated result
    consolidatedResult.stats.filesProcessed = Math.max(
      consolidatedResult.stats.filesProcessed,
      renameResult.stats.filesProcessed
    );
    consolidatedResult.stats.filesModified += renameResult.stats.filesModified;
    consolidatedResult.stats.objectsRenamed += renameResult.stats.totalOccurrences;

    // Track renamed objects
    consolidatedResult.renamedObjects[oldName] = newName;

    // Track modified files
    renameResult.results.forEach((result) => {
      if (result.replaced) {
        const existingFileIndex = consolidatedResult.modifiedFiles.findIndex(
          (file) => file.filePath === result.filePath
        );

        if (existingFileIndex === -1) {
          consolidatedResult.modifiedFiles.push({
            filePath: result.filePath,
            replacements: [{ oldName, newName, occurrences: result.occurrences }],
          });
        } else {
          consolidatedResult.modifiedFiles[existingFileIndex].replacements.push({
            oldName,
            newName,
            occurrences: result.occurrences,
          });
        }
      }
    });
  }

  console.log(
    `Renamed ${consolidatedResult.stats.objectsRenamed} Lab prefixed objects to Li across ${consolidatedResult.stats.filesModified} files`
  );
  return consolidatedResult;
}

/**
 * Helper function to ensure a directory exists
 * @param {string} dirPath - Directory path to create
 */
function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

/**
 * Renames a path by replacing 'lab-' with 'li-'
 * @param {string} pathStr - Path to rename
 * @returns {string} Renamed path
 */
function renamePath(pathStr: string): string {
  const pathParts = pathStr.split(path.sep);
  const renamedParts = pathParts.map((part) => part.replace(/^lab-/i, 'li-'));
  return renamedParts.join(path.sep);
}

/**
 * Renames occurrences of 'lab-' to 'li-' within file content
 * @param {string} filePath - Path of the file to process
 */
async function renameLabToLiInFile(filePath: string): Promise<void> {
  try {
    const fileExt = path.extname(filePath).toLowerCase();

    // Only process .ts, .html, and .scss files
    if (!['.ts', '.html', '.scss'].includes(fileExt)) {
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = content.replace(/lab-/gi, 'li-');

    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated 'lab-' references in file: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating file content in ${filePath}:`, error);
  }
}

/**
 * Modified moveFiles function that also updates file content
 * @param {string} sourcePath - Source file path
 * @param {string} destinationPath - Destination file path
 */
async function moveAndUpdateFile(sourcePath: string, destinationPath: string): Promise<void> {
  // First copy the file
  await moveFiles(sourcePath, destinationPath);

  // Then update its content
  await renameLabToLiInFile(destinationPath);
}

/**
 * Step 3: Move files from source folder to target folder
 * @param {Array} allExports - Array of all exports with their file paths
 * @param {string} sourceFolder - The source folder path
 * @param {string} targetFolder - The target folder path
 * @returns {Array} Information about moved files
 */
async function moveFilesToTarget(
  allExports: ExportItem[],
  sourceFolder: string,
  targetFolder: string
): Promise<MovedFile[]> {
  console.log(`Moving files from ${sourceFolder} to ${targetFolder}`);

  // Get unique file paths from allExports
  const uniqueFilePaths = [...new Set(allExports.map((exp) => exp.filePath))];
  console.log(`Found ${uniqueFilePaths.length} unique files to move`);

  const movedFiles: MovedFile[] = [];

  for (const sourcePath of uniqueFilePaths) {
    try {
      // Get file name and create new file name by replacing 'lab-' with 'li-'
      const fileName = path.basename(sourcePath);
      const newFileName = fileName.replace(/lab-/i, 'li-');

      // Calculate relative path from sourceFolder
      const relativePath = path.relative(sourceFolder, path.dirname(sourcePath));

      // Rename any lab- folders to li- in the relative path
      const renamedRelativePath = renamePath(relativePath);

      // Create destination path
      const destinationDir = path.join(targetFolder, renamedRelativePath);
      ensureDirectoryExists(destinationDir);
      const destinationPath = path.join(destinationDir, newFileName);

      console.log(`Moving file: ${sourcePath} -> ${destinationPath}`);

      // Move file and update imports
      await moveAndUpdateFile(sourcePath, destinationPath);

      // Check for associated HTML and SCSS files
      const associatedFiles: MovedFile['associatedFiles'] = {};

      // Base name without extension
      const baseFileName = fileName.substring(0, fileName.lastIndexOf('.'));
      const baseNewFileName = newFileName.substring(0, newFileName.lastIndexOf('.'));
      const sourceDir = path.dirname(sourcePath);

      // Check for HTML
      const htmlPath = path.join(sourceDir, `${baseFileName}.html`);
      if (fs.existsSync(htmlPath)) {
        const htmlDestPath = path.join(destinationDir, `${baseNewFileName}.html`);
        await moveAndUpdateFile(htmlPath, htmlDestPath);
        associatedFiles.html = { oldPath: htmlPath, newPath: htmlDestPath };
        console.log(`Moved HTML file: ${htmlPath} -> ${htmlDestPath}`);
      }

      // Check for SCSS
      const scssPath = path.join(sourceDir, `${baseFileName}.scss`);
      if (fs.existsSync(scssPath)) {
        const scssDestPath = path.join(destinationDir, `${baseNewFileName}.scss`);
        await moveAndUpdateFile(scssPath, scssDestPath);
        associatedFiles.scss = { oldPath: scssPath, newPath: scssDestPath };
        console.log(`Moved SCSS file: ${scssPath} -> ${scssDestPath}`);
      }

      // Check for spec.ts
      const specPath = path.join(sourceDir, `${baseFileName}.spec.ts`);
      if (fs.existsSync(specPath)) {
        const specDestPath = path.join(destinationDir, `${baseNewFileName}.spec.ts`);
        await moveAndUpdateFile(specPath, specDestPath);
        associatedFiles.spec = { oldPath: specPath, newPath: specDestPath };
        console.log(`Moved spec file: ${specPath} -> ${specDestPath}`);
      }

      // Track moved file information
      movedFiles.push({
        oldPath: sourcePath,
        newPath: destinationPath,
        fileName: fileName,
        newFileName: newFileName,
        associatedFiles: Object.keys(associatedFiles).length > 0 ? associatedFiles : undefined,
      });
    } catch (error) {
      console.error(`Error moving file ${sourcePath}:`, error);
    }
  }

  console.log(`Successfully moved ${movedFiles.length} files`);
  return movedFiles;
}

/**
 * Main function to refactor app to library
 * @param {Object} options - Configuration options
 * @returns {Object} Information about the refactoring process
 */
async function refactorAppToLib(options: RefactorOptions): Promise<RefactorResult> {
  const { sourceFolder, targetFolder, filePattern, appFolder } = options;

  // Step 1: Extract all exports
  const allExports = extractAllExports(sourceFolder, filePattern);

  // Step 2: Rename Lab prefixes to Li
  const renameResult = renameLabToLi(sourceFolder, filePattern, allExports, appFolder);
  const renameResult2 = renameLabToLi(sourceFolder, filePattern, allExports, targetFolder);

  // Step 3: Move files to target location
  const movedFiles = await moveFilesToTarget(allExports, sourceFolder, targetFolder);

  // Step 4: Replace imports in app folder and destination folder
  fixImportsInFolder(targetFolder, targetFolder);
  console.log(`Updated imports in ${targetFolder} files`);

  // Step 5: Replace imports in app folder
  fixImportsInFolder(appFolder, targetFolder);
  console.log(`Updated imports in ${appFolder} files`);

  return {
    exports: allExports,
    renamedObjects: renameResult.renamedObjects,
    movedFiles: movedFiles,
    importChanges: {
      appFolder,
      movedFiles,
      allExports,
    },
  };
}

// Update to use async/await since refactorAppToLib is now async
async function main(): Promise<void> {
  // const a = extractExportsFromProject(resolvePathFromScript('../libs/lab-lib/src/lib/li-credentials/service'))
  // console.log(a);
  fixImportsInFolder(
    resolvePathFromScript('../libs/lab-lib/src/lib'),
    resolvePathFromScript('../libs/lab-lib/src/lib')
  );

  // fixImportsInFolder(resolvePathFromScript('../libs/lab-lib/src'),
  //   resolvePathFromScript('../libs/lab-lib/src/lib/li-core/pipe'));
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/model'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-core/model'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'), // The folder where imports should be updated
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-service'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-core/entity-service'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'), // The folder where imports should be updated
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/service'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-core/service'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'), // The folder where imports should be updated
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/utils'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-core/utils'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'), // The folder where imports should be updated
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-activity-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-activity'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-brick-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-brick'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-config-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-config'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-credentials-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-credentials'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-entity-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-entity'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-folder-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-folder'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-log-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-log'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-monitor-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-monitor'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-navigable-entity-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-navigable-entity'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-note-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-note'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-note-template-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-note-template'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-open-ai-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-open-ai'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-process-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-process'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-progress-bar-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-progress-bar'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-resource-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-resource'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-rich-text-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-rich-text'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-scenario-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-scenario'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-scenario-template-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-scenario-template'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-share-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-share'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-system-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-system'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-tag-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-tag'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-transformer-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-transformer'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-type-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-type'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-venv-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-venv'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await refactorAppToLib({
  //   sourceFolder: resolvePathFromScript(
  //     '../apps/lab-front/src/app/lab-core/entity-module/lab-view-config-core'
  //   ),
  //   targetFolder: resolvePathFromScript('../libs/lab-lib/src/lib/li-view-config'),
  //   filePattern: '**/lab-*.ts',
  //   appFolder: resolvePathFromScript('../apps/lab-front/src/app'),
  // });
  //
  // await generatePublicApi('../libs/lab-lib/src/lib/li-activity', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-brick', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-config', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-core', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-credentials', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-entity', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-folder', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-log', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-monitor', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-navigable-entity', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-note', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-note-template', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-open-ai', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-process', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-progress-bar', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-resource', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-rich-text', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-scenario', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-scenario-template', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-share', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-system', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-tag', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-transformer', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-type', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-venv', true);
  // await generatePublicApi('../libs/lab-lib/src/lib/li-view-config', true);

  console.log('Refactoring completed successfully!');
}

main();
