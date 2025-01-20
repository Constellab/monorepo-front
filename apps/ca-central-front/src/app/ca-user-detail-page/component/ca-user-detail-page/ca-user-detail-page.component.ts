import { Component, OnInit } from '@angular/core';
import { CaUser } from '../../../ca-core/model/entities/ca-user.class';
import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  FlConfirmDialogInput,
  FlDialogService,
  FlFormDialogInput,
  FlUploadImageDialogConfig,
} from '@monorepo/front-core-lib';
import { CaSpaceService } from '../../../ca-core/service-api/ca-space.service';
import { CaUserSettingsDialogComponent } from '../ca-user-settings-dialog/ca-user-settings-dialog.component';
import { CaUserProfileEditDialogComponent } from '../ca-user-profile-edit-dialog/ca-user-profile-edit-dialog.component';

/**
 * Component that show a form on first user login to complete his information
 */
@Component({
    selector: 'ca-user-detail-page',
    templateUrl: './ca-user-detail-page.component.html',
    styleUrls: ['./ca-user-detail-page.component.scss'],
    standalone: false
})
export class CaUserDetailPageComponent implements OnInit {
  user$: Observable<CaUser>;

  id: string;
  isCurrentUser: boolean = false;

  imageConfig: FlUploadImageDialogConfig;
  deleteImageConfig: FlConfirmDialogInput;

  constructor(
    private authenticatedUserService: CaAuthenticatedUserService,
    private route: ActivatedRoute,
    private spaceService: CaSpaceService,
    private dialogService: FlDialogService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.isCurrentUser = this.authenticatedUserService.getCurrentUser().id === this.id;
      if (this.isCurrentUser) {
        this.user$ = this.authenticatedUserService.getUser$();
      } else {
        this.user$ = this.spaceService.getUserById(this.id);
      }
    });

    this.imageConfig = {
      title: { text: 'upload_profile_picture', translateText: true },
      helpText: { text: 'image_square_help', translateText: true },
      imagePreviewWidth: 200,
      imagePreviewHeight: 200,
      roundImage: true,
      compressOptions: {
        cropWidth: 300,
        cropHeight: 300,
        resizeWidthMax: 300,
      },
      uploadImage: (file: File) => this.authenticatedUserService.uploadPhoto(file),
      uploadImageSuccessMessage: { text: 'profile_picture_uploaded', translateText: true },
    };

    this.deleteImageConfig = {
      title: 'space_delete_photo',
      content: 'space_delete_photo_confirmation',
      observable: this.authenticatedUserService.deletePhoto(),
      successMessage: 'space_photo_deleted',
    };
  }

  openEditProfileDialog(user: CaUser): void {
    const input: FlFormDialogInput<Partial<CaUser>> = {
      mode: 'update',
      object: user,
    };
    this.dialogService.openMediumDialog(CaUserProfileEditDialogComponent, { data: input });
  }

  openSettings(): void {
    this.dialogService.openMediumDialog(CaUserSettingsDialogComponent, {
      autoFocus: false,
    });
  }
}
