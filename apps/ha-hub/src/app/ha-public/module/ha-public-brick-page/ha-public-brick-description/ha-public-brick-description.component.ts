import { Component, computed, OnInit, Signal } from '@angular/core';
import { HaBrick, HaEditBrickDTO } from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { Router } from '@angular/router';
import { HaBrickVersion } from '../../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import { FlDialogService, FlFormDialogInput } from '@monorepo/front-core-lib';
import { HaPublicEditBrickDialogComponent } from '../ha-public-edit-brick-dialog/ha-public-edit-brick-dialog.component';
import { HaReferenceDTO } from '../../../../ha-core/ha-model/ha-entities/ha-version.class';
import { HaMetadataService } from '../../../../ha-core/ha-service/ha-metadata.service';
import { HaAuthService } from '../../../../ha-core/ha-service/ha-auth.service';
import { HaLikeService } from '../../../../ha-core/ha-service/ha-like.service';
import { HaLikeType } from '../../../../ha-core/ha-model/ha-entities/ha-entity-type.enum';
import { HaBrickPageState } from '../../../state/ha-brick-page.state';

@Component({
  selector: 'ha-public-brick-description-page',
  templateUrl: './ha-public-brick-description.component.html',
  styleUrls: ['./ha-public-brick-description.component.scss'],
})
export class HaPublicBrickDescriptionComponent implements OnInit {
  brick: Signal<HaBrick> = computed(() => {
    const brick = this.brickPageState.brick();
    if (brick) {
      this.onBrick(brick);
    }
    return brick;
  });
  latestBrickVersion: Signal<HaBrickVersion> = this.brickPageState.latestBrickVersion;
  userHasEditRight: Signal<boolean> = this.brickPageState.getUserHasEditRight();
  directReferences: Signal<HaReferenceDTO[]> = this.brickPageState.getDirectReferences();

  brickIsLiked = false;

  constructor(
    private router: Router,
    private dialogService: FlDialogService,
    private metadataService: HaMetadataService,
    private authService: HaAuthService,
    private likeService: HaLikeService,
    private brickPageState: HaBrickPageState
  ) {}

  ngOnInit(): void {}

  createEditBrickDialog(): void {
    const node: HaEditBrickDTO = new HaEditBrickDTO();
    node.id = this.brick().id;
    node.description = this.brick().description;
    node.gitRepo = this.brick().gitRepo;
    node.pipRepo = this.brick().pipRepo;
    node.visibility = this.brick().visibility;
    node.credentialUsername = this.brick().credentialUsername;
    node.credentialPassword = this.brick().credentialPassword;
    node.space = this.brick().space;
    node.imageLink = this.brick().imageLink;

    const input: FlFormDialogInput<HaEditBrickDTO> = {
      mode: 'update',
      object: node,
    };

    this.openSmallDialog(input);
  }

  toggleLikeBrickButton(): void {
    if (this.brickIsLiked) {
      this.unlikeBrick();
    } else {
      this.likeBrick();
    }
  }

  private onBrick(brick: HaBrick): void {
    this.likeService.checkIfLiked(HaLikeType.BRICK_LIKE, brick.id).subscribe((isLiked) => {
      this.brickIsLiked = isLiked;
    });
    this.metadataService.setPageTitle('ha.brick.title', true, {
      title: brick.name,
    });
    this.metadataService.addMetaTag('description', 'ha.brick.description', true, { description: brick.name });
  }

  private openSmallDialog(input: any): void {
    this.dialogService
      .openMediumDialog(HaPublicEditBrickDialogComponent, { data: input })
      .afterClosed()
      .subscribe((brick) => {
        if (brick) {
          this.brick = brick;
        }
      });
  }

  // TODO : utiliser le state
  private unlikeBrick(): void {
    this.likeService.unlike(HaLikeType.BRICK_LIKE, this.brick().id).subscribe((brick: HaBrick) => {
      if (brick != null) {
        this.brickPageState.setBrick(brick);
        this.brickIsLiked = false;
      }
    });
  }

  private likeBrick(): void {
    if (!this.authService.hasAuthorizationCookie()) {
      // navigate to login page
      this.router.navigate(['/login']);
      return;
    }
    this.likeService.like(HaLikeType.BRICK_LIKE, this.brick().id).subscribe((brick: HaBrick) => {
      if (brick != null) {
        this.brickPageState.setBrick(brick);
        this.brickIsLiked = true;
      }
    });
  }
}
