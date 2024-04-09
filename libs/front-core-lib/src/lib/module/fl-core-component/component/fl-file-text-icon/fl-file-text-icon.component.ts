import {Component, Input, OnInit} from '@angular/core';

enum FlFileIconColor {
  Default = "var(--light-color)",
  Csv = "#008000",
  Pdf = "#ff0000",
  Py = "#FFA500",
  Txt = "#000080",
  Ppt = "#FF6E00FF",
}

@Component({
  selector: 'fl-file-text-icon',
  templateUrl: './fl-file-text-icon.component.html',
  styleUrls: ['./fl-file-text-icon.component.scss']
})
export class FlFileTextIconComponent implements OnInit {

  @Input({required: true}) name: string;
  icon: string;
  color: string;


  constructor() {
  }

  ngOnInit(): void {
    this.icon = this.getFileIcon(this.name);
    this.color = this.getFileColor(this.name);
  }

  private getExtensionColor(extension: string): string {
    switch (extension.toLowerCase()) {
      case "xls":
      case "xlsx":
      case "csv":
        return FlFileIconColor.Csv;
      case "pdf":
        return FlFileIconColor.Pdf;
      case "py":
        return FlFileIconColor.Py;
      case "txt":
      case "docx":
        return FlFileIconColor.Txt;
      case "ppt":
        return FlFileIconColor.Ppt;
      default:
        return FlFileIconColor.Default;
    }
  }

  private getFileIcon(filename: string): string {
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
      return 'file-line-icon';
    return extension + '-file-icon';
  }

  private getFileColor(filename: string): string {
    const fileExtension = filename.split('.').pop();
    return this.getExtensionColor(fileExtension);
  }
}
