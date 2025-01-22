import { Component } from '@angular/core';
import { CaFolderSearchComponent } from '../../../../ca-core/entity-module/ca-folder-core/component/ca-folder-search/ca-folder-search.component';

@Component({
  selector: 'ca-current-space-folders-page',
  templateUrl: './ca-current-space-folders-page.component.html',
  styleUrls: ['./ca-current-space-folders-page.component.scss'],
  imports: [CaFolderSearchComponent],
})
export class CaCurrentSpaceFoldersPageComponent {}
