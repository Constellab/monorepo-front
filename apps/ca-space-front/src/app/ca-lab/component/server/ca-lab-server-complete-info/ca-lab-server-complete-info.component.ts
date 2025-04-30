import { Component, Input } from '@angular/core';
import { CaServerCompleteInfo } from '../../../../ca-core/model/entities/lab/ca-lab-server.class';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { FlJsonEditorModule } from '@monorepo/front-core-lib/fl-json-editor';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { TranslatePipe } from '@ngx-translate/core';

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
