import { Component, inject, OnInit } from '@angular/core';
import { CaGroup } from '../../../../model/entities/ca-group.entity';
import { Observable } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { CaSelectGroupComponent } from '../ca-select-group/ca-select-group.component';
import { MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

export interface CaGroupShareDialogInput {
  // method call to share object with the group
  share: (group: CaGroup) => Observable<any>;
}

/**
 * Dialog to share an object to a group
 */
@Component({
  selector: 'ca-group-share-dialog',
  templateUrl: './ca-group-share-dialog.component.html',
  styleUrls: ['./ca-group-share-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    FlFormModule,
    CaSelectGroupComponent,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaGroupShareDialogComponent implements OnInit {
  private input = inject<CaGroupShareDialogInput>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<CaGroupShareDialogComponent>>(MatDialogRef);
  private snackBarService = inject(FlSnackBarService);

  formControl: FormControl<CaGroup>;

  isLoading: boolean = false;

  ngOnInit(): void {
    this.formControl = new FormControl<CaGroup>(null, Validators.required);
  }

  submit(): void {
    if (this.formControl.valid && !this.isLoading) {
      this.shareObject(this.formControl.value);
    }
  }

  private shareObject(group: CaGroup): void {
    this.isLoading = true;
    this.input.share(group).subscribe({
      next: (result) => this.shareObjectSuccess(result),
      error: () => (this.isLoading = false),
    });
  }

  private shareObjectSuccess(result: any): void {
    this.snackBarService.openSuccessMessage({ text: 'object_shared', translateText: true });
    this.isLoading = false;
    this.dialogRef.close(result);
  }
}
