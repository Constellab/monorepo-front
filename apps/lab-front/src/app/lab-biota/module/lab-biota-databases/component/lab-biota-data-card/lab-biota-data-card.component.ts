import { Component, Input, OnInit } from '@angular/core';
import { LabBiotaData } from '../../../../model/lab-biota-data.class';
import { FlCardModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlJsonEditorModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-json-editor/fl-json-editor.module';
import { FlDateModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';
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
