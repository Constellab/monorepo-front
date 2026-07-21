import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CoRagflowChatbotBubbleComponent } from '@monorepo/community-lib';
import { ClBrick } from '@monorepo/core-lib';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlExpansionMenuModule } from '@monorepo/front-core-lib/fl-expansion-menu';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import {
  LiAuthenticatedUserService,
  LiBrickEntity,
  LiBrickService,
  LiRouterService,
  LiSystemInfo,
  LiSystemService,
} from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LabEnvStore } from '../../../lab-core/lab-env.store';
import { LabEnvironmentHelper } from '../../../lab-core/lab-environment.helper';
import { LAB_BIOTA_MENU_LINK, labGetMainMenuLinks, LabMainMenuLink } from '../../lab-main-menu-link.class';
import { LabMainMenuSettingsComponent } from '../lab-main-menu-settings/lab-main-menu-settings.component';

@Component({
  selector: 'lab-main-app',
  templateUrl: './lab-main-app.component.html',
  styleUrls: ['./lab-main-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    NgClass,
    FlExpansionMenuModule,
    RouterLink,
    FlCoreDirectiveModule,
    MatDivider,
    MatAnchor,
    RouterLinkActive,
    MatTooltip,
    MatIcon,
    FlIconModule,
    MatButton,
    LabMainMenuSettingsComponent,
    RouterOutlet,
    TranslatePipe,
    CoRagflowChatbotBubbleComponent,
  ],
})
export class LabMainAppComponent implements OnInit {
  private labEnvManager = inject(LabEnvStore);
  private authenticatedUserService = inject(LiAuthenticatedUserService);
  private systemService = inject(LiSystemService);
  private titleService = inject(Title);
  private brickService = inject(LiBrickService);
  private http = inject(HttpClient);

  accessibleLinks: LabMainMenuLink[] = labGetMainMenuLinks();

  isChatbotActive = false;

  spaceAppUrl: string = LabEnvironmentHelper.getSpaceFrontAppUrl();

  menuExpanded: boolean = true;

  appRoute = LiRouterService.getAppRoute();

  labName: string;

  logo = 'assets/fl-logo/constellab-logo.svg';
  spaceName?: string = null;

  toolbarColorClass: string;

  ngOnInit(): void {
    this.authenticatedUserService.loadAuthenticatedUser();
    // init lab name
    this.setLabName('Lab');
    this.getLabInfo();
    this.checkBiota();
    this.checkChatbotActive();

    this.toolbarColorClass = this.labEnvManager.isDev() ? 'g-accent-background' : 'g-card-background';
  }

  private checkChatbotActive(): void {
    this.http
      .get<{ active: boolean }>(`${LabEnvironmentHelper.getCommunityApiUrl()}/ragflow-chatbot/status`)
      .subscribe({
        next: (res) => (this.isChatbotActive = res.active),
        error: () => (this.isChatbotActive = false),
      });
  }

  private checkBiota(): void {
    this.brickService.getBrick(ClBrick.GWS_BIOTA).subscribe((brick) => this.checkBiotaSuccess(brick));
  }

  private checkBiotaSuccess(brick: LiBrickEntity): void {
    if (brick && brick.status.value !== 'CRITICAL') {
      this.accessibleLinks.push(LAB_BIOTA_MENU_LINK);
    }
  }

  private getLabInfo(): void {
    this.systemService.getSystemInfo().subscribe((systemInfo) => this.getSystemInfoSuccess(systemInfo));
  }

  private getSystemInfoSuccess(systemInfo: LiSystemInfo): void {
    this.setLabName(systemInfo.lab.name);
    if (systemInfo.lab.spaceName) {
      this.spaceName = systemInfo.lab.spaceName;
    }
  }

  private setLabName(labName: string): void {
    this.labName = labName;
    this.titleService.setTitle(labName);
  }
}
