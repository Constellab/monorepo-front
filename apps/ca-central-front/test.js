const fs = require('fs');
const path = require('path');

// const directoryPath = path.join(__dirname, 'src'); // Adjust this to your project's source directory
const directoryPath = "C:\\Users\\benji\\Documents\\Projects\\Gencovery\\monorepo-front\\apps\\ca-central-front\\src\\app\\ca-lab\\component\\backup\\ca-lab-backup-history"

function updateImportPaths(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        updateImportPaths(filePath);
      } else if (filePath.endsWith('.ts')) {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            return console.log(err);
          }

          const result = data.replace(
            /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]*\/front-core-lib\/src[^'"]*)['"]/g,
            (match, classes, path) => {
              return classes.split(',').map(cls => `import { ${cls.trim()} } from '@monorepo/front-core-lib';`).join('\n');
            }
          );

          fs.writeFile(filePath, result, 'utf8', (err) => {
            if (err) return console.log(err);
          });
        });
      }
    });
  });
}

updateImportPaths(directoryPath);
