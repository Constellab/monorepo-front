export class HaFileHelper {
  public static getFileIcon(filename: string): string {
    const availableFileExtensionsIcon = [
      'csv',
      'exe',
      'gif',
      'jpg',
      'json',
      'pdf',
      'png',
      'py',
      'png',
      'py',
      'txt',
      'xls',
      'xlsx',
      'zip',
      'sql',
      'docx',
      'jpeg'
    ]
    const extension = filename.split('.').pop();
    if (!availableFileExtensionsIcon.includes(extension))
      return 'assets/file-icons/file-line-icon.svg';
    return 'assets/file-icons/' + extension + '-file-icon.svg';
  }
}
