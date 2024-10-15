import { Component, computed, OnInit, Signal } from '@angular/core';
import { HaBrickVersionDataSource } from '../../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import { HaBrickVersionService } from '../../../../ha-core/ha-service/ha-brick-version.service';
import { ActivatedRoute } from '@angular/router';
import { HaBrickService } from '../../../../ha-core/ha-service/ha-brick.service';
import { FlDialogService, FlFormDialogInput } from '@monorepo/front-core-lib';
import { HaNewVersionDTO } from '../../../../ha-core/ha-model/ha-entities/ha-version.class';
import {
  HaPublicAddVersionDialogComponent
} from '../ha-public-add-version-dialog/ha-public-add-version-dialog.component';
import { HaNodeDTO } from '../../../../ha-core/ha-model/ha-entities/ha-node.class';
import { HaMetadataService } from '../../../../ha-core/ha-service/ha-metadata.service';
import { Observable } from 'rxjs';
import { HaAuthenticatedUserService } from '../../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaBrickPageState } from '../../../state/ha-brick-page.state';
import { HaBrick } from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';

@Component({
  selector: 'ha-public-versions-page',
  templateUrl: './ha-public-versions.component.html',
  styleUrls: ['./ha-public-versions.component.scss']
})
export class HaPublicVersionsComponent implements OnInit {

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
    private metadataService: HaMetadataService,
    private brickPageState: HaBrickPageState) {
  }

  ngOnInit(): void {

  }

  private init(brick: HaBrick): void {
    this.metadataService.setPageTitle('ha.versions.brick.title', true, { brickTitle: brick.name });
    this.metadataService.addMetaTag('description', 'ha.versions.brick.description', true, { brickTitle: brick.name });
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
        isBeta: false
      } as HaNewVersionDTO
    };

    this.dialogService.openSmallDialog(HaPublicAddVersionDialogComponent, { data: input }).afterClosed().subscribe(
      (res: HaNodeDTO) => {
        if (res != null) {
          this.setDataSource(this.brick());
        }
      }
    );
  }

  private setDataSource(brick: HaBrick): void {
    this.brickVersions = this.brickVersionService.getDataSource(brick.id);
  }
}
