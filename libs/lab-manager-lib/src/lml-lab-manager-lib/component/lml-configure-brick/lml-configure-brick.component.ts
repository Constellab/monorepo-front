import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoBrick, CoSpace } from '@monorepo/community-lib';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';

import { LmlBrickService } from '../../lml-brick.service';
import { LmlCommunityBrick, LmlCommunityBrickDatasource } from '../../model/lml-brick.class';
import { LmlLabManagerBrickVersionDTO } from '../../model/lml-lab-manager.class';

interface LmlCommunityBrickFilers {
  spaceIds: string[];
  title: string;
}

interface LmlConfigureBrickDialogData {
  brickVersionDTO?: LmlLabManagerBrickVersionDTO;
}

@Component({
  selector: 'lml-config-brick',
  templateUrl: './lml-configure-brick.component.html',
  styleUrls: ['./lml-configure-brick.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LmlConfigureBrickComponent implements OnInit {
  formGp = new FormBuilder().group({
    name: [null as string, Validators.required],
    version: [null as string, Validators.required],
    brick: [null as CoBrick, Validators.required],
  });
  brickSelectionMode: boolean = true;
  isLoading: boolean = true;

  bricks$: LmlCommunityBrickDatasource<LmlCommunityBrickFilers>;

  versions: string[];
  oldVersions: string[];

  spaceIdFilter: string[] = [];
  titleFormControl: FormControl<string> = new FormControl('');

  isUpdate: boolean;

  private dialogData: LmlConfigureBrickDialogData = inject(MAT_DIALOG_DATA);
  private brickVersionDTO = this.dialogData.brickVersionDTO;
  private dialogRef = inject(MatDialogRef);
  private communityBrickService = inject(LmlBrickService);

  spaceActivated: boolean = this.communityBrickService.spaceActivated();
  spaces$: Observable<CoSpace[]> = this.communityBrickService.getMySpaces();

  ngOnInit(): void {
    this.isUpdate = this.brickVersionDTO != null;

    if (this.brickVersionDTO) {
      this.formGp.patchValue(this.brickVersionDTO);
    }

    if (this.isUpdate) {
      this.brickSelectionMode = false;
      this.communityBrickService.getByName(this.brickVersionDTO.name).subscribe((brick) => {
        this.initBrickVersionSelection(brick);
      });
    }

    if (this.brickSelectionMode) {
      this.initBrickSelection();
    }
  }

  isSelected(spaceId: string): boolean {
    return this.spaceIdFilter.find((id) => id == spaceId) != null;
  }

  updateBricks(): void {
    this.bricks$.getFirstPage({
      spaceIds: this.spaceIdFilter,
      title: this.titleFormControl.value,
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

  onBrickSelected(brick: LmlCommunityBrick): void {
    this.brickSelectionMode = false;
    this.isLoading = true;
    this.initBrickVersionSelection(brick);
  }

  private initBrickSelection(): void {
    this.bricks$ = new FlEntityPaginatedDatasource(
      (page, size, requestData) =>
        this.communityBrickService.getAllWithFilters(
          requestData.filtersCriteria.spaceIds,
          requestData.filtersCriteria.title,
          page,
          size
        ),
      10,
      { initFirstPage: false }
    );
    this.updateBricks();
    this.isLoading = false;
  }

  private initBrickVersionSelection(brick: LmlCommunityBrick): void {
    this.formGp.controls.name.patchValue(brick?.name);
    this.formGp.controls.brick.patchValue(brick);
    this.communityBrickService.getVersionsList(brick.name).subscribe((versionsList) => {
      if (this.formGp.controls.version.value && versionsList.includes(this.formGp.controls.version.value)) {
        const splitIndex = versionsList.indexOf(this.formGp.controls.version.value);
        this.versions = versionsList.slice(0, splitIndex + 1);
        if (splitIndex + 1 < versionsList.length) this.oldVersions = versionsList.slice(splitIndex + 1);
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
