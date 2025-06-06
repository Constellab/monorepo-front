import { Component } from '@angular/core';
import { LiTagSearchComponent } from '@monorepo/lab-lib/li-tag';
import { LiTagKeyModel } from '@monorepo/lab-lib/li-core';

@Component({
  selector: 'lab-tag-search-page',
  imports: [LiTagSearchComponent],
  templateUrl: './lab-tag-search-page.component.html',
  styleUrl: './lab-tag-search-page.component.scss',
})
export class LabTagSearchPageComponent {

  onTagSelected(tag: LiTagKeyModel): void{
    console.log('Tag selected:', tag);
  }
}
