import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabAppSubdomainDialogInput {
  appName: string;
  currentSubdomain?: string;
}

/**
 * Result of the subdomain dialog.
 * - subdomain set -> set the custom subdomain
 * - clear === true -> clear the custom subdomain
 */
export interface LabAppSubdomainDialogResult {
  subdomain?: string;
  clear?: boolean;
}

interface LabSubdomainForm {
  subdomain: FormControl<string>;
}

// DNS label: lowercase letters, digits and hyphens, must start/end with an alphanumeric char.
const DNS_LABEL_PATTERN = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

/**
 * Dialog to set or clear the custom subdomain of an app.
 */
@Component({
  selector: 'lab-app-subdomain-dialog',
  templateUrl: './lab-app-subdomain-dialog.component.html',
  styleUrl: './lab-app-subdomain-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatHint,
    MatError,
    MatInput,
    MatButton,
    TranslatePipe,
  ],
})
export class LabAppSubdomainDialogComponent {
  private dialogRef =
    inject<MatDialogRef<LabAppSubdomainDialogComponent, LabAppSubdomainDialogResult>>(MatDialogRef);

  public readonly data = inject<LabAppSubdomainDialogInput>(MAT_DIALOG_DATA);

  formGp: FormGroup<LabSubdomainForm> = new FormGroup<LabSubdomainForm>({
    subdomain: new FormControl(this.data.currentSubdomain ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(DNS_LABEL_PATTERN)],
    }),
  });

  public get canClear(): boolean {
    return !!this.data.currentSubdomain;
  }

  public submit(): void {
    if (this.formGp.valid) {
      this.dialogRef.close({ subdomain: this.formGp.getRawValue().subdomain });
    }
  }

  public clear(): void {
    this.dialogRef.close({ clear: true });
  }
}
