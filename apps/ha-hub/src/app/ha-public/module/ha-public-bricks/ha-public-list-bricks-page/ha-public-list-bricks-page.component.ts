import {Component, Inject, makeStateKey, OnInit, PLATFORM_ID, StateKey, TransferState} from '@angular/core';
import {HaBrickService} from '../../../../ha-core/ha-service/ha-brick.service';
import {HaBrick, HaBrickDatasourcePaginated} from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import {HaRouterService} from '../../../../ha-core/ha-service/ha-router.service';

import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {HaMetadataService} from '../../../../ha-core/ha-service/ha-metadata.service';
import {FormControl} from '@angular/forms';
import {HaUser} from '../../../../ha-core/ha-model/ha-entities/ha-user';
import {HaAuthenticatedUserService} from '../../../../ha-core/ha-service/ha-authenticated-user.service';

@Component({
  selector: 'ha-public-list-bricks-page',
  templateUrl: './ha-public-list-bricks-page.component.html',
  styleUrls: ['./ha-public-list-bricks-page.component.scss']
})
export class HaPublicListBricksPageComponent implements OnInit {

  bricks: HaBrickDatasourcePaginated;
  BRICKS_KEY: StateKey<object>;
  spaceIdFilter: string[] = [];
  titleFormControl: FormControl<string> = new FormControl('');
  user: HaUser;

  constructor(private haBrickService: HaBrickService,
              @Inject(PLATFORM_ID) private platformId: object,
              private transferState: TransferState,
              private metadataService: HaMetadataService,
              private authenticatedUserService: HaAuthenticatedUserService){
  }

  ngOnInit(): void {
    this.authenticatedUserService.getUser().subscribe(user => {
      this.user = user;
    });
    this.metadataService.setPageTitle('ha.bricks.title');
    this.metadataService.addMetaTag('description', 'ha.bricks.description');
    this.BRICKS_KEY = makeStateKey('bricks');
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.BRICKS_KEY)) {
      this.bricks = this.transferState.get(this.BRICKS_KEY, null) as HaBrickDatasourcePaginated;
      this.transferState.remove(this.BRICKS_KEY);
    }

    if(this.bricks == null) {
      this.bricks = this.haBrickService.getAllWithFiltersPaginated();
      if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.BRICKS_KEY)) {
        this.transferState.set(this.BRICKS_KEY, this.bricks);
      }
    }

    this.updateBricks();
  }

  loadMoreResults(): void {
    this.bricks.getNextPage();
  }

  getBrickRoute(brick: HaBrick): string {
    return HaRouterService.getBrickPageRoute(brick.name);
  }

  search(event): void {
    event.preventDefault();
    this.updateBricks();
  }

  updateBricks(): void {
    this.bricks.getFirstPage({
      spacesFilter: this.spaceIdFilter,
      titleFilter: this.titleFormControl.value
    })
  }

  isSelected(spaceId: string): boolean {
    return this.spaceIdFilter.find((id) => id == spaceId) != null;
  }

  selectSpace(spaceId: string): void {
    if(this.isSelected(spaceId)){
      this.spaceIdFilter = this.spaceIdFilter.filter((id) => id != spaceId);
    } else {
      this.spaceIdFilter.push(spaceId);
    }
    this.updateBricks();
  }

  onSpace(spaceId: string): void{
    this.selectSpace(spaceId)
  }
}
