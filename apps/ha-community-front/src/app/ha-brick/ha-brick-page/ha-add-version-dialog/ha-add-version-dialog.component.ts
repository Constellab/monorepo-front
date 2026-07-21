import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import {
  HaAddVersionInput,
  HaBrickSettingsDTO,
  HaNewVersionDTO,
  HaNewVersionFile,
} from '../../../ha-core/ha-model/ha-entities/ha-version.class';
import { HaBrickService } from '../../../ha-core/ha-service/ha-brick.service';

@Component({
  selector: 'ha-add-version-dialog',
  templateUrl: './ha-add-version-dialog.component.html',
  styleUrls: ['./ha-add-version-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    FlInputFileModule,
    FlLoaderModule,
    MatDivider,
    ReactiveFormsModule,
    FlKeyValueModule,
    MatDialogActions,
    MatButton,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class HaAddVersionDialogComponent
  extends FlFormDialogAbstractDirective<Partial<HaNewVersionDTO>>
  implements OnInit
{
  private brickService = inject(HaBrickService);

  brickName: string;
  isUpdate: boolean = false;
  inputFile: HaAddVersionInput;
  rawSettings: HaBrickSettingsDTO;
  errorFile: boolean;
  errorFileText: string;
  isLoadingImport: boolean = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.isUpdate = this.dialogInput.mode == 'update';
    this.init();
    this.brickName = this.dialogInput.object.brickName;
    this.errorFile = false;
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      version: [null, [Validators.pattern(new RegExp('^(\\d+\\.)(\\d+\\.)(\\*|\\d+)$'))]],
      repoType: [null],
      isBeta: [false],
      subPatch: [null],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(_formValue: Partial<HaNewVersionDTO>): Observable<any> {
    return this.brickService.createVersionFromSettings(this.rawSettings);
  }

  update(): Observable<Partial<HaNewVersionDTO>> {
    return undefined;
  }

  getCreateSuccessMessage(): string {
    return 'new_version_added';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }

  onFileSelected($event: File): void {
    this.isLoadingImport = true;
    if ($event == null) {
      return;
    }
    this.errorFile = false;
    if (!$event.name.endsWith('.json')) {
      this.errorFile = true;
      this.errorFileText = 'file_wrong_type';
    }
    if (typeof FileReader !== 'undefined' && !this.errorFile) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        let srcResult: any;
        try {
          srcResult = JSON.parse(e.target.result);
        } catch {
          this.isLoadingImport = false;
          this.errorFile = true;
          this.errorFileText = 'file_invalid_json';
          return;
        }
        if ((srcResult as HaNewVersionFile) && this.isSettingJson(srcResult)) {
          this.brickService.isActualBrickAndNewVersion(srcResult.name, srcResult.version).subscribe((res) => {
            if (res.sameBrick) {
              this.rawSettings = srcResult;
              this.inputFile = new HaAddVersionInput(
                true,
                srcResult.name,
                srcResult.version,
                srcResult.environment,
                srcResult.technical_info
              );
              this.isUpdate = res.sameVersion;
            } else {
              this.errorFile = true;
              this.errorFileText = 'file_wrong_brick_or_major';
            }
            this.isLoadingImport = false;
          });
        } else {
          this.isLoadingImport = false;
          this.errorFile = true;
          this.errorFileText = 'file_wrong_type';
        }
      };

      reader.readAsText($event);
    }
  }

  private isSettingJson(file: HaNewVersionFile): boolean {
    return file.name != null && file.version != null && file.environment != null;
  }
}
