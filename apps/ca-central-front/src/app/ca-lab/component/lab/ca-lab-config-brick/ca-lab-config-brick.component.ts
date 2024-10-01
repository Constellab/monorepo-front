import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import { CaSpace } from '../../../../ca-core/model/entities/space/ca-space.class';
import { CaSpaceService } from '../../../../ca-core/service-api/ca-space.service';
import { CaAuthenticatedUserService } from '../../../../ca-core/service-api/ca-authenticated-user.service';
import { CaCommunityBrickService } from '../../../../ca-core/service-api/ca-community-brick.service';
import { CaLabManagerBrickVersionDTO } from '../../../../ca-core/model/entities/lab/ca-lab-manager.class';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  CaCommunityBrick,
  CaCommunityBrickDatasource
} from '../../../../ca-core/model/entities/ca-community-brick.class';
import { CoBrick } from '@monorepo/community-lib';

interface CaCommunityBrickFilers {
  spaceIds: string[];
  title: string;
}


@Component({
  selector: 'ca-lab-config-brick',
  templateUrl: './ca-lab-config-brick.component.html',
  styleUrls: ['./ca-lab-config-brick.component.scss']
})
export class CaLabConfigBrickComponent implements OnInit {

  formGp = new FormBuilder().group({
    name: [null as string, Validators.required],
    version: [null as string, Validators.required],
    brick: [null as CoBrick, Validators.required]
  });
  brickSelectionMode: boolean = true;
  isLoading: boolean = true;

  bricks$: CaCommunityBrickDatasource<CaCommunityBrickFilers>;
  spaces: CaSpace[];
  versions: string[];
  oldVersions: string[];

  spaceIdFilter: string[] = [];
  titleFormControl: FormControl<string> = new FormControl('');

  isUpdate: boolean;
  userId: string;

  constructor(@Inject(MAT_DIALOG_DATA) private brickVersionDTO: CaLabManagerBrickVersionDTO,
              private dialogRef: MatDialogRef<CaLabConfigBrickComponent>,
              private spaceService: CaSpaceService,
              private communityBrickService: CaCommunityBrickService,
              private authenticatedUserService: CaAuthenticatedUserService) {
  }

  get title(): string {
    return 'lab_add_brick';
  }

  ngOnInit(): void {
    this.isUpdate = this.brickVersionDTO != null;

    if (this.brickVersionDTO) {
      this.formGp.patchValue(this.brickVersionDTO);
    }

    this.authenticatedUserService.getUser$().subscribe((user) => {
      this.userId = user.id;

      if (this.isUpdate) {
        this.brickSelectionMode = false;
        this.communityBrickService.getByName(this.brickVersionDTO.name, this.userId).subscribe((brick) => {
          this.initBrickVersionSelection(brick);
        });
      }

      if (this.brickSelectionMode) {
        this.initBrickSelection();
      }
    });
  }



  isSelected(spaceId: string): boolean {
    return this.spaceIdFilter.find((id) => id == spaceId) != null;
  }

  updateBricks(): void {
    this.bricks$.getFirstPage({
      spaceIds: this.spaceIdFilter,
      title: this.titleFormControl.value
    });
  }

  selectSpace(spaceId: string): void {
    if (this.isSelected(spaceId)) {
      this.spaceIdFilter = this.spaceIdFilter.filter((id) => id != spaceId);
    } else {
      this.spaceIdFilter.push(spaceId);
    }
    this.updateBricks();
  }

  search(): void {
    this.updateBricks();
  }

  onBrickSelected(brick: CaCommunityBrick): void {
    this.brickSelectionMode = false;
    this.isLoading = true;
    this.initBrickVersionSelection(brick);
  }

  private initBrickSelection(): void {
    this.spaceService.getMySpaces().subscribe((spaces) => {
      this.spaces = spaces;
    });

    this.bricks$ = new FlEntityPaginatedDatasource(
      (page, size, requestData) =>
        this.communityBrickService.getAllWithFilters(requestData.filtersCriteria.spaceIds,
          requestData.filtersCriteria.title, page, size, this.userId), 10, false);
    this.updateBricks();
    this.isLoading = false;

  }

  private initBrickVersionSelection(brick: CaCommunityBrick): void {
    this.formGp.controls.name.patchValue(brick?.name);
    this.formGp.controls.brick.patchValue(brick);
    this.communityBrickService.getVersionsList(brick.id, this.userId).subscribe((versionsList) => {
      if (this.isUpdate && this.formGp.controls.version.value) {
        const splitIndex = versionsList.indexOf(this.formGp.controls.version.value);
        this.versions = versionsList.slice(0, splitIndex + 1);
        if (splitIndex + 1 < versionsList.length)
          this.oldVersions = versionsList.slice(splitIndex + 1);
      } else {
        this.versions = versionsList;
      }
      this.isLoading = false;
    });
  }

  changeBrick(): void {
    this.brickSelectionMode = true;
    this.isLoading = true;
    this.initBrickSelection();
  }

  toggleLowerVersion(checkEvent: MatCheckboxChange): void {
    if (checkEvent.checked) {
      this.versions = this.versions.concat(this.oldVersions);
    } else {
      this.versions = this.versions.filter((version) => !this.oldVersions.includes(version));
    }
  }

  submit(): void {
    if (this.formGp.valid) {
      this.dialogRef.close(this.formGp.getRawValue());
    }
  }
}
