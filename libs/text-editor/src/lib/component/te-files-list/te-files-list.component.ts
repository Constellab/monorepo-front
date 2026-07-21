import { ChangeDetectionStrategy,Component, input } from '@angular/core';

import { TeBlockFileUploadResponse } from '../../model/lib';

@Component({
  selector: 'te-files-list',
  templateUrl: './te-files-list.component.html',
  styleUrl: './te-files-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TeFilesListComponent {
  files = input.required<TeBlockFileUploadResponse[]>();

  urlToDownloadPrefix = input.required<string>();
}
