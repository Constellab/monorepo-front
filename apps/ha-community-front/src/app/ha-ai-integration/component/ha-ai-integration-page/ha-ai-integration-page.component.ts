import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaHideServerSideDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-hide-server-side/ha-hide-server-side.directive';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaClaudeMcpCardComponent } from '../ha-claude-mcp-card/ha-claude-mcp-card.component';

/**
 * Page listing the AI tools that can be connected to Community.
 * Today it holds the Claude Code card only, it is the place where the next ones go.
 */
@Component({
  selector: 'ha-ai-integration-page',
  templateUrl: './ha-ai-integration-page.component.html',
  styleUrls: ['./ha-ai-integration-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [HaPageComponent, HaClaudeMcpCardComponent, HaHideServerSideDirective, TranslatePipe],
})
export class HaAiIntegrationPageComponent extends HaCommunityPageDirective implements OnInit {
  ngOnInit(): void {
    super.setMetaTags(
      { text: 'ai_integration.page_title', translateText: true },
      { text: 'ai_integration.page_description', translateText: true },
      '',
      HaRouterService.getFullRoute(HaRouterService.getAiIntegrationRoute())
    );
  }
}
