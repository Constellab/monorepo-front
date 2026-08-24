import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlConfirmDialogInput, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlImageModule, FlUploadImageDialogConfig } from '@monorepo/front-core-lib/fl-image';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaLabFreeCardInfoComponent } from '../../../ca-core/entity-module/ca-lab-core/component/ca-lab-free-card-info/ca-lab-free-card-info.component';
import { CaUser } from '../../../ca-core/model/entities/ca-user.class';
import { CaIsAdminDirective } from '../../../ca-core/module/ca-core-directive/ca-is-admin/ca-is-admin.directive';
import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';
import { CaSpaceService } from '../../../ca-core/service-api/ca-space.service';
import { CaClaudeMcpCardComponent } from '../ca-claude-mcp-card/ca-claude-mcp-card.component';
import { CaUserProfileEditDialogComponent } from '../ca-user-profile-edit-dialog/ca-user-profile-edit-dialog.component';
import { CaUserSettingsDialogComponent } from '../ca-user-settings-dialog/ca-user-settings-dialog.component';
import { CaUserSpacesListComponent } from '../ca-user-spaces-list/ca-user-spaces-list.component';

/**
 * Component that show a form on first user login to complete his information
 */
@Component({
  selector: 'ca-user-detail-page',
  templateUrl: './ca-user-detail-page.component.html',
  styleUrls: ['./ca-user-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlSectionModule,
    FlCardModule,
    MatButton,
    MatIcon,
    FlImageModule,
    FlUserModule,
    FlTextIconModule,
    CaIsAdminDirective,
    CaUserSpacesListComponent,
    CaLabFreeCardInfoComponent,
    CaClaudeMcpCardComponent,
    TranslatePipe,
  ],
})
export class CaUserDetailPageComponent implements OnInit {
  private authenticatedUserService = inject(CaAuthenticatedUserService);
  private route = inject(ActivatedRoute);
  private spaceService = inject(CaSpaceService);
  private dialogService = inject(FlDialogService);

  user$: Observable<CaUser>;

  id: string;
  isCurrentUser: boolean = false;

  imageConfig: FlUploadImageDialogConfig;
  deleteImageConfig: FlConfirmDialogInput;

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
