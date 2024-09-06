import { Component, Input } from '@angular/core';
import { CaFolder } from '../../../../model/entities/project/ca-folder.class';

@Component({
  selector: 'ca-folder-inline',
  templateUrl: './ca-folder-inline.component.html',
  styleUrl: './ca-folder-inline.component.scss'
})
export class CaFolderInlineComponent {

  @Input({ required: true }) folder: CaFolder;
}
