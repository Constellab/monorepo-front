import { Component, Input, OnInit } from '@angular/core';
import { FlFileHelper } from '../../../../service/fl-file.helper';

/**
 * Show an icon based on the file extension
 */
@Component({
  selector: 'fl-file-text-icon',
  templateUrl: './fl-file-text-icon.component.html',
  styleUrls: ['./fl-file-text-icon.component.scss']
})
export class FlFileTextIconComponent implements OnInit {

  @Input({required: true}) filename: string;

  @Input() isConstellabDocument: boolean = false;

  icon: string;

  ngOnInit(): void {
    this.icon = this.getFileIcon(this.filename);
  }

  private getFileIcon(filename: string): string {
    if(this.isConstellabDocument){
      return 'constellab_document';
    }

    const extension = FlFileHelper.getFileExtension(filename);

    if (!extension) return 'description';

    // Get the flIcon name based on the file extension
    switch (extension.toLowerCase()) {
      case 'csv':
      case 'xls':
      case 'xlsx':
        return 'csv_file_icon';
      case 'jpeg':
      case 'jpg':
      case 'png':
      case 'gif':
      case 'svg':
        return 'image';
      case 'txt':
        return 'txt_file_icon';
      case 'pdf':
        return 'pdf_file_icon';
      case 'doc':
      case 'docx':
        return 'docx_file_icon';
      case 'json':
        return 'json_file_icon';
      case 'ppt':
      case 'pptx':
        return 'pptx_file_icon';
      case 'zip':
        return 'zip_file_icon';
      case 'py':
        return 'py_file_icon';
      default:
        return 'description';
    }
  }
}
