import { Component, Input } from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlJsonEditorModule } from '@monorepo/front-core-lib/fl-json-editor';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { TranslatePipe } from '@ngx-translate/core';

import { CaServerCompleteInfo } from '../../../../ca-core/model/entities/lab/ca-lab-server.class';

@Component({
  selector: 'ca-lab-server-complete-info',
  templateUrl: './ca-lab-server-complete-info.component.html',
  styleUrls: ['./ca-lab-server-complete-info.component.scss'],
  imports: [
    FlKeyValueModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    FlJsonEditorModule,
    FlCoreComponentModule,
    TranslatePipe,
  ],
})
export class CaLabServerCompleteInfoComponent {
  @Input({ required: true }) serverCompleteInfo: CaServerCompleteInfo;
}
