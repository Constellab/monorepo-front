import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlImageModule, FlUploadImageDialogConfig } from '@monorepo/front-core-lib/fl-image';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaSpacePhotoComponent } from '../../../../ca-core/entity-module/ca-space-core/component/ca-space-photo/ca-space-photo.component';
import { CaSpace } from '../../../../ca-core/model/entities/space/ca-space.class';
import { CaSpaceSettingsDto } from '../../../../ca-core/model/entities/space/ca-space.dto';
import { CaIsSpaceAdminDirective } from '../../../../ca-core/module/ca-core-directive/ca-is-space-admlin/ca-is-space-admin.directive';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaCurrentSpaceService } from '../../../../ca-core/service-api/ca-current-space.service';
import { CaSpaceService } from '../../../../ca-core/service-api/ca-space.service';
import { CaRequestNewLicensesComponent } from '../ca-request-new-licenses/ca-request-new-licenses.component';

/**
 * Show all the information about a space
 */
@Component({
  selector: 'ca-current-space-detail',
  templateUrl: './ca-current-space-detail.component.html',
  styleUrls: ['./ca-current-space-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    CaIsSpaceAdminDirective,
    MatButton,
    MatIconButton,
    MatTooltip,
    MatIcon,
    FlImageModule,
    CaSpacePhotoComponent,
    FlFormModule,
    FlTextIconModule,
    FlIconModule,
    FlKeyValueModule,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaCurrentSpaceDetailComponent implements OnInit {
  private dialogService = inject(FlDialogService);
  private spaceService = inject(CaSpaceService);
  private currentSpaceService = inject(CaCurrentSpaceService);
  private routerService = inject(CaRouterService);

  @Input() spaceSettings: CaSpaceSettingsDto;

  space$: Observable<CaSpace>;
  spaceImage$: Observable<string | null>;
  imageConfig$: Observable<FlUploadImageDialogConfig>;
  deleteImageConfig: Observable<FlConfirmDialogInput>;

  isSpaceAdmin: boolean;

  ngOnInit(): void {
    this.space$ = this.currentSpaceService.getCurrentSpace$();
    this.isSpaceAdmin = this.currentSpaceService.isSpaceAdmin();
    this.spaceImage$ = this.currentSpaceService.getCurrentSpacePhoto$();

    this.imageConfig$ = this.currentSpaceService.getCurrentSpace$().pipe(
      map((space) => ({
        title: { text: 'space_upload_photo', translateText: true },
        helpText: { text: 'image_square_help', translateText: true },
        imagePreviewWidth: 200,
        imagePreviewHeight: 200,
        roundImage: true,
        compressOptions: {
          cropWidth: 300,
          cropHeight: 300,
          resizeWidthMax: 300,
        },
        uploadImage: (file: File) => this.spaceService.uploadSpacePhoto(space.id, file),
        uploadImageSuccessMessage: { text: 'space_photo_uploaded', translateText: true },
      }))
    );

    this.deleteImageConfig = this.currentSpaceService.getCurrentSpace$().pipe(
      map((space) => ({
        title: 'space_delete_photo',
        content: 'space_delete_photo_confirmation',
        observable: this.spaceService.deleteSpacePhoto(space.id),
        successMessage: 'space_photo_deleted',
      }))
    );
  }

  onSpaceUpdate(space?: CaSpace): void {
    if (space) {
      this.currentSpaceService.setCurrentSpace(space);
    }
  }

  openDeleteSpace(space: CaSpace): void {
    const data: FlConfirmDialogInput = {
      title: 'delete_space',
      content: 'delete_space_confirmation',
      observable: this.spaceService.deleteById(space.id),
      successMessage: 'space_deleted',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result));
  }

  private onDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.routerService.navigateToAdmin();
    }
  }

  openRequestNewLicense(): void {
    this.dialogService.openMediumDialog(CaRequestNewLicensesComponent);
  }

  updateSpaceName(name: string): void {
    this.spaceService
      .updateCurrentSpaceName(name)
      .subscribe((space: CaSpace) => this.onUpdateSpaceNameSuccess(space));
  }

  private onUpdateSpaceNameSuccess(space: CaSpace): void {
    this.currentSpaceService.setCurrentSpace(space);
  }
}
