import { Component, Input } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlJsonEditorModule } from '@monorepo/front-core-lib/fl-json-editor';
import { TranslatePipe } from '@ngx-translate/core';

import { LabBiotaData } from '../../../../model/lab-biota-data.class';

/**
 * Simple card for biota data
 */
@Component({
  selector: 'lab-biota-data-card',
  templateUrl: './lab-biota-data-card.component.html',
  styleUrls: ['./lab-biota-data-card.component.scss'],
  imports: [FlCardModule, FlJsonEditorModule, FlDateModule, TranslatePipe],
})
export class LabBiotaDataCardComponent {
  @Input() biotaData: LabBiotaData;
}
