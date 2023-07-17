import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {HaBrickService} from '../../../../ha-core/ha-service/ha-brick.service';
import {HaBrick} from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import {HaRouterService} from '../../../../ha-core/ha-service/ha-router.service';
import {makeStateKey, StateKey, TransferState} from '@angular/platform-browser';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {HaMetadataService} from '../../../../ha-core/ha-service/ha-metadata.service';
import {ClVersion} from '@monorepo/core-lib';

@Component({
  selector: 'ha-public-list-bricks-page',
  templateUrl: './ha-public-list-bricks-page.component.html',
  styleUrls: ['./ha-public-list-bricks-page.component.scss']
})
export class HaPublicListBricksPageComponent implements OnInit {

  bricks: HaBrick[];
  BRICKS_KEY: StateKey<object>;

  constructor(private haBrickService: HaBrickService,
              @Inject(PLATFORM_ID) private platformId: object,
              private transferState: TransferState,
              private metadataService: HaMetadataService) {
  }

  ngOnInit(): void {
    this.metadataService.setPageTitle('ha.bricks.title');
    this.metadataService.addMetaTag('description', 'ha.bricks.description');
    this.BRICKS_KEY = makeStateKey('bricks');
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.BRICKS_KEY)) {
      this.bricks = this.transferState.get(this.BRICKS_KEY, null) as HaBrick[];
      this.transferState.remove(this.BRICKS_KEY);
      for (const b of this.bricks) {
        b.lastVersion = new ClVersion(b.lastVersion.major, b.lastVersion.minor, b.lastVersion.patch, b.lastVersion.subPatch);
      }
    }

    this.setupBricks();
  }

  private setupBricks(): void {
    this.haBrickService.get().subscribe((bricks: HaBrick[]) => {
      for (const b of bricks) {
        b.lastVersion = new ClVersion(b.lastVersion.major, b.lastVersion.minor, b.lastVersion.patch, b.lastVersion.subPatch);
      }
      this.bricks = bricks;
      if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.BRICKS_KEY)) {
        this.transferState.set(this.BRICKS_KEY, this.bricks);
      }
    });
  }

  getBrickRoute(brick: HaBrick): string {
    return HaRouterService.getBrickPageRoute(brick.name);
  }

}
