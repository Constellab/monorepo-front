import { Component, Input, OnInit } from '@angular/core';
import { FlFileHelper } from '../../../../service/fl-file.helper';
import { getFileIconFromExtension } from '../../../fl-svg-icon/fl-icon-config.class';

/**
 * Show an icon based on the file extension
 */
@Component({
  selector: 'fl-file-text-icon',
  templateUrl: './fl-file-text-icon.component.html',
  styleUrls: ['./fl-file-text-icon.component.scss'],
})
export class FlFileTextIconComponent implements OnInit {
  @Input({ required: true }) filename: string;

  @Input() isConstellabDocument: boolean = false;

  icon: string;

  ngOnInit(): void {
    this.icon = this.getFileIcon(this.filename);
  }

  private getFileIcon(filename: string): string {
    if (this.isConstellabDocument) {
      return 'constellab_document';
    }

    const extension = FlFileHelper.getFileExtension(filename);

    return getFileIconFromExtension(extension);
  }
}
