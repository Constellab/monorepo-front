import { Component, inject, OnInit } from '@angular/core';
import { getMainMenuLinks, labBiotaMenuLink, LabMainMenuLink } from '../../lab-main-menu-link.class';
import { LabEnvironmentHelper } from '../../../lab-core/utils/lab-environment.helper';
import { LabAuthenticatedUserService } from '../../../lab-core/service/lab-authenticated-user.service';
import { LabRouterService } from '../../../lab-core/service/lab-router.service';
import { LabSystemService } from '../../../lab-core/service/lab-system.service';
import { Title } from '@angular/platform-browser';
import { LabSystemInfo } from '../../../lab-core/model/global/lab-system.class';
import { LabBrickService } from '../../../lab-core/entity-service/lab-brick.service';
import { LabBrickEntity } from '../../../lab-core/model/entities/lab-brick.entity';
import { TdBrick } from '@monorepo/technical-doc';
import { LabEnvStore } from '../../../lab-core/service/lab-env.store';
import { NgClass } from '@angular/common';
import { FlExpansionMenuModule } from '@monorepo/front-core-lib/fl-expansion-menu';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { MatDivider } from '@angular/material/divider';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LabMainMenuSettingsComponent } from '../lab-main-menu-settings/lab-main-menu-settings.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-main-app',
  templateUrl: './lab-main-app.component.html',
  styleUrls: ['./lab-main-app.component.scss'],
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
  ],
})
export class LabMainAppComponent implements OnInit {
  private labEnvManager = inject(LabEnvStore);
  private authenticatedUserService = inject(LabAuthenticatedUserService);
  private systemService = inject(LabSystemService);
  private titleService = inject(Title);
  private brickService = inject(LabBrickService);

  accessibleLinks: LabMainMenuLink[] = getMainMenuLinks();

  spaceAppUrl: string = LabEnvironmentHelper.getSpaceFrontAppUrl();

  menuExpanded: boolean = true;

  appRoute = LabRouterService.getAppRoute();

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

    this.toolbarColorClass = this.labEnvManager.isDev() ? 'g-accent-background' : 'g-card-background';
  }

  private checkBiota(): void {
    this.brickService.getBrick(TdBrick.GWS_BIOTA).subscribe((brick) => this.checkBiotaSuccess(brick));
  }

  private checkBiotaSuccess(brick: LabBrickEntity): void {
    if (brick && brick.status.value !== 'CRITICAL') {
      this.accessibleLinks.push(labBiotaMenuLink);
    }
  }

  private getLabInfo(): void {
    this.systemService.getSystemInfo().subscribe((systemInfo) => this.getSystemInfoSuccess(systemInfo));
  }

  private getSystemInfoSuccess(systemInfo: LabSystemInfo): void {
    this.setLabName(systemInfo.labName);
    if (systemInfo.space) {
      this.spaceName = systemInfo.space.name;
      if (systemInfo.space.photo) {
        this.logo = this.systemService.getSpacePhotoUrl(systemInfo.space.photo);
      }
    } else {
      console.error('No space found');
    }
  }

  private setLabName(labName: string): void {
    this.labName = labName;
    this.titleService.setTitle(labName);
  }
}
