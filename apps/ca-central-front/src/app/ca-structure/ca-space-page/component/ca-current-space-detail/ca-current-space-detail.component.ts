import {Component, Input, OnInit} from '@angular/core';
import {CaSpace} from '../../../../ca-core/model/entities/space/ca-space.class';
import {FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService} from '@monorepo/front-core-lib';
import {CaSpaceService} from '../../../../ca-core/service-api/ca-space.service';
import {CaRouterService} from '../../../../ca-core/service/ca-router.service';
import {
  CaSpaceUploadPhotoDialogComponent,
  CaSpaceUploadPhotoDialogInput
} from '../ca-space-upload-photo-dialog/ca-space-upload-photo-dialog.component';
import {CaCurrentSpaceService} from '../../../../ca-core/service-api/ca-current-space.service';
import {Observable} from 'rxjs';
import {CaRequestNewLicensesComponent} from '../ca-request-new-licenses/ca-request-new-licenses.component';
import {CaSpaceSettingsDto} from '../../../../ca-core/model/entities/space/ca-space.dto';
import {
  CaSpaceLicenseFormDialogComponent
} from '../../../../ca-core/entity-module/ca-space-core/component/ca-space-license-form-dialog/ca-space-license-form-dialog.component';

/**
 * Show all the information about a space
 */
@Component({
  selector: 'ca-current-space-detail',
  templateUrl: './ca-current-space-detail.component.html',
  styleUrls: ['./ca-current-space-detail.component.scss']
})
export class CaCurrentSpaceDetailComponent implements OnInit {

  @Input() spaceSettings: CaSpaceSettingsDto;

  space$: Observable<CaSpace>;
  isSpaceAdmin: boolean;

  constructor(private dialogService: FlDialogService,
              private spaceService: CaSpaceService,
              private currentSpaceService: CaCurrentSpaceService,
              private routerService: CaRouterService) {
  }

  ngOnInit(): void {
    this.space$ = this.currentSpaceService.getCurrentSpace$();
    this.isSpaceAdmin = this.currentSpaceService.isSpaceAdmin();
  }

  openUploadPhotoDialog(space: CaSpace): void {
    const data: CaSpaceUploadPhotoDialogInput = {
      spaceId: space.id
    };

    this.dialogService.openSmallDialog(CaSpaceUploadPhotoDialogComponent,
      {data: data}).afterClosed().subscribe(
      (result: CaSpace) => this.onUploadPhotoClosed(result));
  }

  private onUploadPhotoClosed(space?: CaSpace): void {
    if (space) {
      this.currentSpaceService.setCurrentSpace(space);
    }
  }

  openUpdateLicense(nbOfLicenses: number): void {
    this.dialogService.openSmallDialog(CaSpaceLicenseFormDialogComponent, {data: nbOfLicenses})
      .afterClosed().subscribe((spaceSettingsDto: CaSpaceSettingsDto) => this.onUpdateClosed(spaceSettingsDto));
  }

  private onUpdateClosed(spaceSettingsDto?: CaSpaceSettingsDto): void {
    if (spaceSettingsDto) {
      this.currentSpaceService.setCurrentSpace(spaceSettingsDto.space);
      this.spaceSettings = spaceSettingsDto;
    }
  }

  openDeleteSpace(space: CaSpace): void {
    const data: FlConfirmDialogInput = {
      title: 'delete_space',
      content: 'delete_space_confirmation',
      translateTitleAndContent: true,
      observable: this.spaceService.deleteById(space.id),
      successMessage: 'space_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(data).afterClosed().subscribe(
      result => this.onDeleteClosed(result)
    );
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
    this.spaceService.updateCurrentSpaceName(name).subscribe(
      (space: CaSpace) => this.onUpdateSpaceNameSuccess(space)
    );
  }

  private onUpdateSpaceNameSuccess(space: CaSpace): void {
    this.currentSpaceService.setCurrentSpace(space);
  }

}
