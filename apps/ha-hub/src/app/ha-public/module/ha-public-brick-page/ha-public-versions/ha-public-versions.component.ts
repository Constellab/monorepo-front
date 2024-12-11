import { Component, computed, OnInit, Signal } from '@angular/core';
import { HaBrickVersionDataSource } from '../../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import { HaBrickVersionService } from '../../../../ha-core/ha-service/ha-brick-version.service';
import { FlDialogService, FlFormDialogInput, FlTranslateService } from '@monorepo/front-core-lib';
import { HaNewVersionDTO } from '../../../../ha-core/ha-model/ha-entities/ha-version.class';
import { HaPublicAddVersionDialogComponent } from '../ha-public-add-version-dialog/ha-public-add-version-dialog.component';
import { HaNodeDTO } from '../../../../ha-core/ha-model/ha-entities/ha-node.class';
import { HaMetadataService } from '../../../../ha-core/ha-service/ha-metadata.service';
import { HaBrickPageState } from '../../../state/ha-brick-page.state';
import { HaBrick } from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaCommunityPage } from '../../../../ha-core/utils/ha-community.page';
import { HaRouterService } from '../../../../ha-core/ha-service/ha-router.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ha-public-versions-page',
  templateUrl: './ha-public-versions.component.html',
  styleUrls: ['./ha-public-versions.component.scss'],
})
export class HaPublicVersionsComponent extends HaCommunityPage implements OnInit {
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

  constructor(
    private brickVersionService: HaBrickVersionService,
    private dialogService: FlDialogService,
    private brickPageState: HaBrickPageState,
    private router: Router,
    translateService: FlTranslateService,
    metadataService: HaMetadataService
  ) {
    super(translateService, metadataService);
  }

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
