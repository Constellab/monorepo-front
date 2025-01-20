import { Component, Input } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CaSpaceUpdateStorageLocationDTO } from '../../../../model/entities/space/ca-space.dto';

@Component({
    selector: 'ca-space-storage-form',
    templateUrl: './ca-space-storage-form.component.html',
    styleUrl: './ca-space-storage-form.component.scss',
    standalone: false
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
