import { Component, input, Input, OnInit } from '@angular/core';
import {TeFileBlockData} from '../../block/te-file-block';


@Component({
  selector: 'te-files-list',
  templateUrl: './te-files-list.component.html',
  styleUrl: './te-files-list.component.scss',
})
export class TeFilesListComponent {
  files = input.required<TeFileBlockData[]>();

  urlToDownloadPrefix = input.required<string>();
}
