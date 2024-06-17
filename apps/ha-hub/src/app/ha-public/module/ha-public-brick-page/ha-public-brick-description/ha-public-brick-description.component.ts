import {Component, Inject, makeStateKey, OnInit, PLATFORM_ID, StateKey, TransferState} from '@angular/core';
import {HaBrick, HaEditBrickDTO} from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import {HaBrickService} from '../../../../ha-core/ha-service/ha-brick.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HaBrickVersion} from '../../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import {FlDialogService, FlFormDialogInput} from '@monorepo/front-core-lib';
import {HaPublicEditBrickDialogComponent} from '../ha-public-edit-brick-dialog/ha-public-edit-brick-dialog.component';
import {HaReferenceDTO} from '../../../../ha-core/ha-model/ha-entities/ha-version.class';
import {HaBrickVersionService} from '../../../../ha-core/ha-service/ha-brick-version.service';
import {HaAuthenticatedUserService} from '../../../../ha-core/ha-service/ha-authenticated-user.service';
import {Observable} from 'rxjs';

import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {HaMetadataService} from '../../../../ha-core/ha-service/ha-metadata.service';
import {ClVersion} from '@monorepo/core-lib';
import {HaAuthService} from '../../../../ha-core/ha-service/ha-auth.service';
import {HaLikeService} from '../../../../ha-core/ha-service/ha-like.service';
import {HaLikeType} from '../../../../ha-core/ha-model/ha-entities/ha-entity-type.enum';

@Component({
  selector: 'ha-public-brick-description-page',
  templateUrl: './ha-public-brick-description.component.html',
  styleUrls: ['./ha-public-brick-description.component.scss']
})
export class HaPublicBrickDescriptionComponent implements OnInit {

  brick: HaBrick;
  latestBrickVersion: HaBrickVersion;
  lastVersion: ClVersion;
  references: HaReferenceDTO[];
  isCreatorOrBrickUser$: Observable<boolean>;

  BRICK_DESCRIPTION_VERSION_KEY: StateKey<object>;
  BRICK_DESCRIPTION_KEY: StateKey<object>;

  brickIsLiked = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private brickService: HaBrickService,
    private brickVersionService: HaBrickVersionService,
    private dialogService: FlDialogService,
    private authUserService: HaAuthenticatedUserService,
    @Inject(PLATFORM_ID) private platformId: object,
    private transferState: TransferState,
    private metadataService: HaMetadataService,
    private authService: HaAuthService,
    private likeService: HaLikeService) {

  }

  ngOnInit(): void {
    this.BRICK_DESCRIPTION_KEY = makeStateKey<object>('BRICK_DESCRIPTION_KEY');
    this.BRICK_DESCRIPTION_VERSION_KEY = makeStateKey<object>('BRICK_DESCRIPTION_VERSION_KEY');

    this.init();
  }

  private init(): void {
    this.route.parent.params.subscribe(params => {
      this.setLastBrickVersion(params.brickName);
      this.setBrick(params.brickName);
    });
  }

  private setBrick(brickName: string): void {
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.BRICK_DESCRIPTION_KEY)) {
      this.onBrick(this.transferState.get(this.BRICK_DESCRIPTION_KEY, null) as HaBrick);
      this.transferState.remove(this.BRICK_DESCRIPTION_KEY);
    }
    this.brickService.getByName(brickName).subscribe(brick => {
      if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.BRICK_DESCRIPTION_KEY)) {
        this.transferState.set(this.BRICK_DESCRIPTION_KEY, brick);
      }
      this.onBrick(brick);
      this.isCreatorOrBrickUser$ = this.authUserService.isBrickCreatorOrBrickUser(brick);
    });
  }

  private onBrick(brick: HaBrick): void {
    this.brick = brick;
    this.likeService.checkIfLiked(HaLikeType.BRICK_LIKE, brick.id).subscribe((isLiked) => {
      this.brickIsLiked = isLiked;
    });
    this.metadataService.setPageTitle('ha.brick.title', true, {title: brick.name});
    this.metadataService.addMetaTag('description', 'ha.brick.description', true, {description: brick.name});
  }

  private setLastBrickVersion(brickName: string): void {
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.BRICK_DESCRIPTION_VERSION_KEY)) {
      const data = this.transferState.get(this.BRICK_DESCRIPTION_VERSION_KEY, null) as HaBrickVersion;
      this.transferState.remove(this.BRICK_DESCRIPTION_VERSION_KEY);
      this.onLatestBrickVersion(data);
    }
    this.brickService.getLastVersion(brickName).subscribe(res => {
      this.onLatestBrickVersion(res);
    });
  }

  private onLatestBrickVersion(brickVersion: HaBrickVersion): void {
    this.latestBrickVersion = brickVersion;
    this.lastVersion = new ClVersion(brickVersion.brickMajorVersion.major, brickVersion.minor, brickVersion.patch, brickVersion.subPatch);
    if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.BRICK_DESCRIPTION_VERSION_KEY)) {
      this.transferState.set(this.BRICK_DESCRIPTION_VERSION_KEY, brickVersion);
    }
    this.setDirectReferences(brickVersion.id);
  }

  private setDirectReferences(brickVersionId: string): void {
    this.brickVersionService.getDirectReferences(brickVersionId).subscribe(res => {
      this.references = res;
    });
  }

  createEditBrickDialog(): void {
    const node: HaEditBrickDTO = new HaEditBrickDTO();
    node.id = this.brick.id;
    node.description = this.brick.description;
    node.gitRepo = this.brick.gitRepo;
    node.pipRepo = this.brick.pipRepo;
    node.visibility = this.brick.visibility;
    node.credentialUsername = this.brick.credentialUsername;
    node.credentialPassword = this.brick.credentialPassword;
    node.space = this.brick.space;
    node.imageLink = this.brick.imageLink;

    const input: FlFormDialogInput<HaEditBrickDTO> = {
      mode: 'update',
      object: node
    };

    this.openSmallDialog(input);
  }

  private openSmallDialog(input: any): void {
    this.dialogService.openMediumDialog(HaPublicEditBrickDialogComponent, {data: input}).afterClosed().subscribe(
      (brick) => {
        if(brick){
          this.brick = brick;
          console.log('BRICK', brick)
        }
      }
    );
  }

  toggleLikeBrickButton(): void{
    if(this.brickIsLiked){
      this.unlikeBrick();
    } else {
      this.likeBrick();
    }
  }

  private unlikeBrick(): void {
    this.likeService.unlike(HaLikeType.BRICK_LIKE, this.brick.id).subscribe((brick: HaBrick) => {
      if (brick != null) {
        this.brick = brick;
        this.brickIsLiked = false;
      }
    });
  }

  private likeBrick(): void {
    if (!this.authService.hasAuthorizationCookie()){
      // navigate to login page
      this.router.navigate(['/login'])
      return;
    }
    this.likeService.like(HaLikeType.BRICK_LIKE, this.brick.id).subscribe((brick: HaBrick) => {
      if (brick != null) {
        this.brick = brick;
        this.brickIsLiked = true;
      }
    });
  }
}
