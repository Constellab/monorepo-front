import { ChangeDetectionStrategy,Component, computed, inject, OnDestroy, Signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';

import { HaTdServiceConfig } from '../../../ha-core/ha-model/ha-config/ha-td-service.config';
import { HaAgent } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaJsonLdState } from '../../../ha-core/ha-state/ha-json-ld.state';
import { HaAgentPageState } from '../../state/ha-agent-page.state';
import { HaAgentTextEditorConfig } from '../ha-agent-core/ha-agent-text-editor.config';
import { HaAgentVersionDetailComponent } from '../ha-agent-version-detail/ha-agent-version-detail.component';

@Component({
  selector: 'ha-agent-overview',
  templateUrl: './ha-agent-overview.component.html',
  styleUrls: ['./ha-agent-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CoCommunityLibModule,
    FlFormModule,
    FlUserModule,
    FlDateModule,
    FlLoaderModule,
    TeTextEditorModule,
    ReactiveFormsModule,
    HaAgentVersionDetailComponent,
    MatButton,
    TranslatePipe,
  ],
})
export class HaAgentOverviewComponent extends HaCommunityPageDirective implements OnDestroy {
  private agentPageState: HaAgentPageState = inject(HaAgentPageState);
  private agentService = inject(HaAgentService);
  private tdService: HaTdServiceConfig = inject(HaTdServiceConfig);
  private jsonLdState: HaJsonLdState = inject(HaJsonLdState);

  agent: Signal<HaAgent> = computed(() => {
    const agent_ = this.agentPageState.getAgent()();
    const agentImage: string =
      agent_.latestStyle.icon_type === 'COMMUNITY_IMAGE'
        ? this.tdService.getCommunityIconBaseApiUrl() + `/${agent_.latestStyle.icon_technical_name}`
        : null;
    const pageUrl = HaRouterService.getFullRoute(
      HaRouterService.getAgentRoute(agent_.id, ClStringHelper.getCleanUrlPath(agent_.title))
    );

    super.setMetaTags(
      { text: 'ha.agent.title', translateParam: { param: { title: agent_.title } } },
      {
        text: 'ha.agent.description',
        translateParam: { param: { title: agent_.title, author: agent_.createdBy?.alias } },
      },
      agentImage,
      pageUrl
    );

    this.jsonLdState.setSoftwareAppJsonLdContent(agent_.title, pageUrl, agentImage);

    return agent_;
  });
  agentDescriptionFormControl = computed(() => {
    const agent = this.agent();
    const formControl = new FormControl<TeRichText>(agent ? agent.description : null);
    formControl.disable();
    return formControl;
  });
  textEditorConfig: Signal<HaAgentTextEditorConfig> = computed(() => {
    return new HaAgentTextEditorConfig(this.agentService, this.agent().id);
  });
  canEdit = this.agentPageState.canEditAgent;
  onAgentDescriptionLoading: boolean = false;

  editDescription(): void {
    this.agentDescriptionFormControl().enable();
  }

  saveDescription(): void {
    if (this.agent().description?.contentAreEquals(this.agentDescriptionFormControl().value)) {
      this.agentDescriptionFormControl().disable();
      return;
    }

    this.onAgentDescriptionLoading = true;
    this.agentService
      .saveAgentDescription(this.agent().id, this.agentDescriptionFormControl().value)
      .subscribe((updatedAgent) => {
        this.agentPageState.setAgent(updatedAgent);
        this.onAgentDescriptionLoading = false;
        this.agentDescriptionFormControl().disable();
      });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.jsonLdState.clearJsonLdContent();
  }
}
