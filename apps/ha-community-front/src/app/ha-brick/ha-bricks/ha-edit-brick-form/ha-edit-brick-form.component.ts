import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { Router } from '@angular/router';
import { FlGlobalValidators } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { HaBrickCreationDTO, HaBrickVisibility } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaSpace } from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import { HaAddVersionInput, HaRepoType } from '../../../ha-core/ha-model/ha-entities/ha-version.class';
import { HaBrickService } from '../../../ha-core/ha-service/ha-brick.service';
import { HaSpaceService } from '../../../ha-core/ha-service/ha-space.service';

@Component({
  selector: 'ha-edit-brick-form',
  templateUrl: './ha-edit-brick-form.component.html',
  styleUrls: ['./ha-edit-brick-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlInputFileModule,
    ReactiveFormsModule,
    FlKeyValueModule,
    MatDivider,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatRadioGroup,
    MatRadioButton,
    MatButton,
    FlLoaderModule,
    TranslatePipe,
    FlCorePipeModule,
  ],
})
export class HaEditBrickFormComponent implements OnInit {
  private brickService = inject(HaBrickService);
  private router = inject(Router);
  private snackBarService = inject(FlSnackBarService);
  private spaceService = inject(HaSpaceService);

  brick: HaBrickCreationDTO;

  formGp: UntypedFormGroup;

  isLoading: boolean;
  inputFile: HaAddVersionInput | null;
  errorFile: boolean;
  errorFileText: string;
  repoError: boolean;
  errorInput: Record<string, boolean> = {};
  spaces: HaSpace[];
  fileName: string = '';

  ngOnInit(): void {
    this.spaceService.getSpacesOfCurrentUser().subscribe({
      next: (spaces) => {
        this.spaces = spaces;
        this.buildForm();
      },
      error: () => {
        this.snackBarService.openErrorMessage({ text: 'error_loading_spaces', translateText: true });
      },
    });
  }

  buildForm(): void {
    this.formGp = new FormBuilder().group({
      name: [null, [Validators.required, Validators.pattern(/^\S*$/)]],
      description: [null, [Validators.required, Validators.maxLength(255)]],
      version: [
        null,
        [Validators.required, Validators.pattern(new RegExp('^(\\d+\\.)(\\d+\\.)(\\*|\\d+)$'))],
      ],
      repoType: [HaRepoType.PIP],
      isBeta: [false],
      subPatch: [null, [Validators.min(0), FlGlobalValidators.isInteger]],
      repoGit: [null],
      repoPip: [null],
      technicalInfo: [null],
      references: [null],
      credentialUsername: [null],
      credentialPassword: [null],
      space: [null],
    });
  }

  submit(): void {
    const formValue: Partial<HaBrickCreationDTO> = {
      ...this.formGp.value,
      visibility: this.formGp.value.space ? HaBrickVisibility.PRIVATE : HaBrickVisibility.PUBLIC,
    };

    if (this.formGp.value.repoPip || this.formGp.value.repoGit) {
      this.repoError = false;
      this.formGp.controls.repoPip.removeValidators(Validators.required);
      this.formGp.controls.repoGit.removeValidators(Validators.required);
      if (this.formGp.valid && !this.isLoading) {
        if (this.formGp.value.repoGit && !this.formGp.value.repoPip) {
          formValue.repoType = HaRepoType.GIT;
        }
        this.isLoading = true;
        this.brickService.create(formValue).subscribe({
          next: (brick) => {
            this.isLoading = false;
            this.router.navigateByUrl('/bricks/' + brick.name + '/latest').then();
          },
          error: () => {
            this.isLoading = false;
          },
        });
      }
    } else {
      this.repoError = true;
      this.formGp.controls.repoPip.setValidators(Validators.required);
      this.formGp.controls.repoGit.setValidators(Validators.required);
    }
  }

  onFileSelected($event: File): void {
    this.errorFile = false;
    this.errorInput = {};
    this.inputFile = null;
    this.formGp.reset();
    if ($event == null) {
      return;
    }
    if (!$event.name.endsWith('.json')) {
      this.errorFile = true;
      this.errorFileText = 'file_wrong_type';
      this.snackBarService.openErrorMessage({ text: this.errorFileText, translateText: true });
      this.fileName = '';
      return;
    }
    if (typeof FileReader !== 'undefined' && !this.errorFile) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        let srcResult: any;
        try {
          srcResult = JSON.parse((e.target as FileReader | null)?.result as string);
        } catch {
          this.errorFile = true;
          this.errorFileText = 'file_wrong_format';
          this.snackBarService.openErrorMessage({ text: this.errorFileText, translateText: true });
          this.fileName = '';
          return;
        }

        if (!srcResult.name || !srcResult.version || !srcResult.environment) {
          this.errorFile = true;
          this.errorFileText = 'file_wrong_format';
          this.snackBarService.openErrorMessage({ text: this.errorFileText, translateText: true });
          this.fileName = '';
          return;
        } else {
          this.brickService.checkIfBrickExistByName(srcResult.name).subscribe((res) => {
            if (!res) {
              this.inputFile = new HaAddVersionInput(
                true,
                srcResult.name,
                srcResult.version,
                srcResult.environment,
                srcResult.technical_info
              );
              this.formGp.controls.name.setValue(this.inputFile.name);
              const version: string[] = this.inputFile.version.split('-');
              this.formGp.controls.version.setValue(version[0]);
              this.formGp.controls.references.setValue(this.inputFile.brickVersionReferences);
              this.formGp.controls.technicalInfo.setValue(this.inputFile.technicalInfo);
              this.formGp.controls.isBeta.setValue(this.inputFile.isBeta);

              this.formGp.controls.space.setValue(null);

              this.formGp.controls.repoType.setValue(HaRepoType.PIP);
              if (this.inputFile.isBeta) {
                this.formGp.controls.subPatch.setValue(this.inputFile.subPatch);
              }

              if (!this.formGp.controls.name.valid) {
                this.errorInput['name'] = true;
              }
              if (!this.formGp.controls.version.valid) {
                this.errorInput['version'] = true;
              }
              if (this.errorInput['name'] || this.errorInput['version']) {
                this.errorFile = true;
                this.errorFileText = 'file_wrong_format';
                this.snackBarService.openErrorMessage({ text: this.errorFileText, translateText: true });
                this.fileName = '';
                return;
              }
              this.fileName = $event.name;
            } else {
              this.errorFile = true;
              this.errorFileText = 'brick_already_exists';
              this.snackBarService.openErrorMessage({ text: this.errorFileText, translateText: true });
              this.fileName = '';
              return;
            }
          });
        }
      };

      reader.readAsText($event);
    }
  }
}
