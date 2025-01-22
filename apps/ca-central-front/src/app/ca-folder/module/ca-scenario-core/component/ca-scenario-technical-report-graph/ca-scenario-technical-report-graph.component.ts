import { Component, inject, Input } from '@angular/core';
import { PrProtocolGraph } from '@monorepo/protocol';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { MatDivider } from '@angular/material/divider';
import { PrProtocolModule } from '../../../../../../../../../libs/protocol/src/lib/pr-protocol.module';
import { CaScenarioTechnicalReportLinkComponent } from '../ca-scenario-technical-report-link/ca-scenario-technical-report-link.component';
import { CaScenarioTechnicalReportIntOutComponent } from '../ca-scenario-technical-report-int-out/ca-scenario-technical-report-int-out.component';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-scenario-technical-report-graph',
  templateUrl: './ca-scenario-technical-report-graph.component.html',
  styleUrls: ['./ca-scenario-technical-report-graph.component.scss'],
  imports: [
    MatDivider,
    PrProtocolModule,
    CaScenarioTechnicalReportLinkComponent,
    CaScenarioTechnicalReportIntOutComponent,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaScenarioTechnicalReportGraphComponent {
  @Input({ required: true }) graph: PrProtocolGraph;

  @Input() protocolName?: string;

  communityHelper = inject(CoCommunityHelperService);
}
