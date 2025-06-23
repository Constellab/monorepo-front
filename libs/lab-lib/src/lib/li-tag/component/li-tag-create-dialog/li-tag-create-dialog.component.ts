import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { ClStringHelper } from '@monorepo/core-lib';
import { LiTagKeyModel, LiTagService } from '@monorepo/lab-lib/li-core';
import { Subscription } from 'rxjs';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { MatButton } from '@angular/material/button';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'li-tag-create-dialog',
  imports: [
    FlDialogModule,
    TranslatePipe,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCorePipeModule,
    FlLoaderModule,
    MatButton,
    MatError,
  ],
  templateUrl: './li-tag-create-dialog.component.html',
  styleUrl: './li-tag-create-dialog.component.scss',
})
export class LiTagCreateDialogComponent implements OnInit, OnDestroy {
  private tagService = inject(LiTagService);
  private snackBarService = inject(FlSnackBarService);
  private dialogRef = inject<MatDialogRef<LiTagCreateDialogComponent>>(MatDialogRef);

  formGp: UntypedFormGroup;

  labelSubscription: Subscription;

  keyChanged = false;

  isLoading: boolean = false;

  ngOnInit(): void {
    this.formGp = new FormBuilder().group({
      label: ['', [Validators.required]],
      key: ['', [Validators.required, Validators.pattern('^[a-z0-9_-]+$')]],
    });

    this.labelSubscription = this.formGp.controls['label'].valueChanges.subscribe((label) => {
      if (label && !this.keyChanged) {
        this.formGp.controls['key'].patchValue(ClStringHelper.toKebabCase(label).replaceAll('-', '_'), {
          emitEvent: false,
        });
      }
    });
  }

  submit(): void {
    if (this.formGp.invalid) {
      return;
    }

    this.isLoading = true;

    const tagKey = this.formGp.controls['key'].value;
    const tagLabel = this.formGp.controls['label'].value;

    this.tagService.createTagKey(tagKey, tagLabel).subscribe({
      next: (tagKeyModel: LiTagKeyModel) => {
        this.isLoading = false;
        this.dialogRef.close(tagKeyModel);
      },
      error: (err: any) => {
        this.snackBarService.openErrorMessage({
          text: 'li.tag_creation_error',
          translateText: true,
          translateParam: { param: { error: err.message } },
        });
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.labelSubscription) {
      this.labelSubscription.unsubscribe();
    }
  }
}
