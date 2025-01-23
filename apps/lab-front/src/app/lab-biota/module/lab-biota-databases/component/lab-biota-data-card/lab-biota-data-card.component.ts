import { Component, Input, OnInit } from '@angular/core';
import { LabBiotaData } from '../../../../model/lab-biota-data.class';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlJsonEditorModule } from '@monorepo/front-core-lib/fl-json-editor';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Simple card for biota data
 */
@Component({
  selector: 'lab-biota-data-card',
  templateUrl: './lab-biota-data-card.component.html',
  styleUrls: ['./lab-biota-data-card.component.scss'],
  imports: [FlCardModule, FlJsonEditorModule, FlDateModule, TranslatePipe],
})
export class LabBiotaDataCardComponent implements OnInit {
  @Input() biotaData: LabBiotaData;

  constructor() {}

  ngOnInit(): void {}
}
