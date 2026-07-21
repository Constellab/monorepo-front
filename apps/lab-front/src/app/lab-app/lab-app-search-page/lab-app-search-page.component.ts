import { ChangeDetectionStrategy,Component } from '@angular/core';
import { LiAppSearchComponent } from '@monorepo/lab-lib/li-resource';

@Component({
  selector: 'lab-app-search-page',
  imports: [LiAppSearchComponent],
  templateUrl: './lab-app-search-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lab-app-search-page.component.scss',
})
export class LabAppSearchPageComponent {}
