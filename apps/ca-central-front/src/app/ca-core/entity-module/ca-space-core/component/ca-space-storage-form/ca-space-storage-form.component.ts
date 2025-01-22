import { Component, Input } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CaSpaceUpdateStorageLocationDTO } from '../../../../model/entities/space/ca-space.dto';
import { MatFormField, MatLabel, MatHint, MatError } from '@angular/material/form-field';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { CaBucketLocationInlineComponent } from '../../../ca-object-storage-core/component/ca-bucket-location-inline/ca-bucket-location-inline.component';
import { CaBucketLocationSelectOptionsComponent } from '../../../ca-object-storage-core/component/ca-bucket-location-select-options/ca-bucket-location-select-options.component';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-space-storage-form',
  templateUrl: './ca-space-storage-form.component.html',
  styleUrl: './ca-space-storage-form.component.scss',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatSelectTrigger,
    CaBucketLocationInlineComponent,
    CaBucketLocationSelectOptionsComponent,
    MatHint,
    MatError,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaSpaceStorageFormComponent {
  @Input({ required: true }) formGp: FormGroup;

  public static buildForm(): UntypedFormGroup {
    const groupOptions: AbstractControlOptions = { validators: [this.differentFolderStorageValidator()] };

    return new FormBuilder().group(
      {
        defaultFolderStorageLocation: [null, [Validators.required]],
        defaultFolderBackupStorageLocation: [null],
      },
      groupOptions
    );
  }

  private static differentFolderStorageValidator(): ValidatorFn {
    return (control: UntypedFormGroup): { [key: string]: any } => {
      const value: CaSpaceUpdateStorageLocationDTO = control.value;
      if (value.defaultFolderStorageLocation == null || value.defaultFolderBackupStorageLocation == null)
        return null;

      if (value.defaultFolderStorageLocation.bucketId === value.defaultFolderBackupStorageLocation.bucketId) {
        return { sameBackupStorage: true };
      }
      return null;
    };
  }
}
