import { ChangeDetectionStrategy,Component, inject, Input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { PrProtocolGraph } from '@monorepo/protocol';
import { PrProtocolModule } from '@monorepo/protocol';
import { TranslatePipe } from '@ngx-translate/core';

import { CaScenarioTechnicalReportIntOutComponent } from '../ca-scenario-technical-report-int-out/ca-scenario-technical-report-int-out.component';
import { CaScenarioTechnicalReportLinkComponent } from '../ca-scenario-technical-report-link/ca-scenario-technical-report-link.component';

@Component({
  selector: 'ca-scenario-technical-report-graph',
  templateUrl: './ca-scenario-technical-report-graph.component.html',
  styleUrls: ['./ca-scenario-technical-report-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
