import { Component, Input } from '@angular/core';
import { CaServerCompleteInfo } from '../../../../ca-core/model/entities/lab/ca-lab-server.class';
import { FlKeyValueModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { FlJsonEditorModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-json-editor/fl-json-editor.module';
import { FlCoreComponentModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-component/fl-core-component.module';
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
