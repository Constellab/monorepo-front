import {Component, Inject, makeStateKey, OnInit, PLATFORM_ID, StateKey, TransferState} from '@angular/core';
import {HaBrickService} from '../../../../ha-core/ha-service/ha-brick.service';
import {ActivatedRoute, Params} from '@angular/router';
import {HaBrick} from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';

import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {HaMetadataService} from '../../../../ha-core/ha-service/ha-metadata.service';
import {HaRouterService} from '../../../../ha-core/ha-service/ha-router.service';

@Component({
  selector: 'ha-public-list-bricks-page',
  templateUrl: './ha-public-brick-page.component.html',
  styleUrls: ['./ha-public-brick-page.component.scss']
})
export class HaPublicBrickPageComponent implements OnInit {

  brickListRoute: string = HaRouterService.getBrickListRoute();
  brick: HaBrick;
  brickNotFound: boolean = false;
  BRICK_KEY: StateKey<object>;
  isLoading: boolean = true;

  constructor(
    private brickService: HaBrickService,
    private activatedRoute: ActivatedRoute,
    private metadataService: HaMetadataService,
    @Inject(PLATFORM_ID) private platformId: object,
    private transferState: TransferState
  ) {
  }

  ngOnInit(): void {
    this.BRICK_KEY = makeStateKey<HaBrick>('brick');

    this.activatedRoute.params.subscribe((params: Params) => {

      // If the version is not latest, then add noindex meta tag to avoid duplicated indexed pages
      if (params.version != 'latest') {
        this.metadataService.addMetaTag('robots', 'noindex');
      }

      this.initBrick(params.brickName);
    });

  }

  private initBrick(name: string): void{
    this.brickNotFound = false;
    this.isLoading = true;

    //Set the brick loaded from the server to the transfer state
    if(isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.BRICK_KEY)){
      this.brick = this.transferState.get(this.BRICK_KEY, null) as HaBrick;
      this.transferState.remove(this.BRICK_KEY);
      this.isLoading = false;
      return;
    }

    this.brickService.getByName(name).subscribe({
      next: (brick: HaBrick) => {
        this.isLoading = false;
        if (!brick) {
          this.brickNotFound = true;
          return;
        }
        this.brick = brick;
        if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.BRICK_KEY)) {
          this.transferState.set(this.BRICK_KEY, brick);
        }
      },
      error: () => {
        this.isLoading = false;
        this.brickNotFound = true;
      }
    });
  }
}

