import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { HaBrickVersionDataSource } from '../../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import { HaBrickVersionService } from '../../../../ha-core/ha-service/ha-brick-version.service';
import { FlDialogService, FlFormDialogInput } from '@monorepo/front-core-lib';
import { HaNewVersionDTO } from '../../../../ha-core/ha-model/ha-entities/ha-version.class';
import { HaPublicAddVersionDialogComponent } from '../ha-public-add-version-dialog/ha-public-add-version-dialog.component';
import { HaNodeDTO } from '../../../../ha-core/ha-model/ha-entities/ha-node.class';
import { HaBrickPageState } from '../../../state/ha-brick-page.state';
import { HaBrick } from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaCommunityPage } from '../../../../ha-core/utils/ha-community.page';
import { HaRouterService } from '../../../../ha-core/ha-service/ha-router.service';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { HaPublicBrickVersionsTableComponent } from '../ha-public-brick-versions-table/ha-public-brick-versions-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ha-public-versions-page',
  templateUrl: './ha-public-versions.component.html',
  styleUrls: ['./ha-public-versions.component.scss'],
  imports: [MatButton, HaPublicBrickVersionsTableComponent, TranslatePipe],
})
export class HaPublicVersionsComponent extends HaCommunityPage implements OnInit {
  private brickVersionService: HaBrickVersionService = inject(HaBrickVersionService);
  private dialogService: FlDialogService = inject(FlDialogService);
  private brickPageState: HaBrickPageState = inject(HaBrickPageState);
  private router: Router = inject(Router);

  brickVersions: HaBrickVersionDataSource;
  brick: Signal<HaBrick> = computed(() => {
    const brick = this.brickPageState.brick();
    if (!brick) {
      return null;
    }
    this.init(brick);
    return brick;
  });
  userHasEditRight: Signal<boolean> = this.brickPageState.getUserHasEditRight();

  ngOnInit(): void {}

  private init(brick: HaBrick): void {
    super.setMetaTags(
      { text: 'ha.versions.brick.title', translateParam: { param: { brickTitle: brick.name } } },
      { text: 'ha.versions.brick.description', translateParam: { param: { brickTitle: brick.name } } },
      brick.imageLink,
      HaRouterService.getFullRoute(this.router.url)
    );
    this.setDataSource(brick);
  }

  openNewVersionDialog(brickId: string): void {
    const input: FlFormDialogInput<HaNewVersionDTO> = {
      mode: 'create',
      object: {
        version: null,
        repoType: null,
        commit: null,
        brickId: brickId,
        subPatch: null,
        isBeta: false,
      } as HaNewVersionDTO,
    };

    this.dialogService
      .openSmallDialog(HaPublicAddVersionDialogComponent, { data: input })
      .afterClosed()
      .subscribe((res: HaNodeDTO) => {
        if (res != null) {
          this.setDataSource(this.brick());
        }
      });
  }

  private setDataSource(brick: HaBrick): void {
    this.brickVersions = this.brickVersionService.getDataSource(brick.id);
  }
}
