import { Component, OnInit, Signal } from '@angular/core';
import { HaBrickService } from '../../../../ha-core/ha-service/ha-brick.service';
import { ActivatedRoute, Params } from '@angular/router';
import { HaBrick } from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaMetadataService } from '../../../../ha-core/ha-service/ha-metadata.service';
import { HaRouterService } from '../../../../ha-core/ha-service/ha-router.service';
import { HaBrickPageState } from '../../../state/ha-brick-page.state';

@Component({
  selector: 'ha-public-list-bricks-page',
  templateUrl: './ha-public-brick-page.component.html',
  styleUrls: ['./ha-public-brick-page.component.scss'],
  providers: [HaBrickPageState],
})
export class HaPublicBrickPageComponent implements OnInit {
  brickListRoute: string = HaRouterService.getBrickListRoute();

  brick: Signal<HaBrick> = this.brickPageState.brick;
  brickNotFound: Signal<boolean> = this.brickPageState.isBrickError;
  isLoading: Signal<boolean> = this.brickPageState.isBrickLoading;

  constructor(
    private brickService: HaBrickService,
    private activatedRoute: ActivatedRoute,
    private metadataService: HaMetadataService,
    private brickPageState: HaBrickPageState
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      // If the version is not latest, then add noindex meta tag to avoid duplicated indexed pages
      if (params.version != 'latest') {
        this.metadataService.addMetaTag('robots', 'noindex');
      }

      this.brickPageState.init(params.brickName, params.version);
    });
  }
}
