import { Component, OnInit, inject } from '@angular/core';
import { CaGroup } from '../../../../model/entities/ca-group.entity';
import { Observable } from 'rxjs';
import { FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlSnackBarService } from '@monorepo/front-core-lib';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { CaSelectGroupComponent } from '../ca-select-group/ca-select-group.component';
import { MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
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
    CdkScrollable,
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
