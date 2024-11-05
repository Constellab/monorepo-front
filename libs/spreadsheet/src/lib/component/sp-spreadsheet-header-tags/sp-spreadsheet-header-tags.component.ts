import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';
import { FlTagColorer } from '@monorepo/front-core-lib';

/**
 * List the tags of a header
 */
@Component({
  selector: 'sp-spreadsheet-header-tags',
  templateUrl: './sp-spreadsheet-header-tags.component.html',
  styleUrls: ['./sp-spreadsheet-header-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpSpreadsheetHeaderTagsComponent {
  @Input() tags: Record<string, string>;

  @Input() tagColorer: FlTagColorer;

  constructor() {}

  hasTags(): boolean {
    return !ClHelpService.isNullOrEmpty(this.tags);
  }
}
