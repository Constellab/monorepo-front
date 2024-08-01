import {Component, Input} from '@angular/core';
import {TeFileBlockData} from '../../block/te-file-block';


@Component({
  selector: 'te-files-list',
  templateUrl: './te-files-list.component.html',
  styleUrl: './te-files-list.component.scss'
})
export class TeFilesListComponent {
  @Input({required: true}) files: TeFileBlockData[];

  @Input({required: true}) urlToDownloadPrefix: string;
}
