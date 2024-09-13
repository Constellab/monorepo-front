import {Component, Input} from '@angular/core';
import {ValidatorFn, Validators} from '@angular/forms';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {CaSpaceUpdateStorageLocationDTO} from '../../../../model/entities/space/ca-space.dto';

@Component({
  selector: 'ca-space-storage-form',
  templateUrl: './ca-space-storage-form.component.html',
  styleUrl: './ca-space-storage-form.component.scss'
})
export class CaSpaceStorageFormComponent {

  @Input({required: true}) formGp: FormGroup;

  public static buildForm(): FormGroup<CaSpaceUpdateStorageLocationDTO> {
    return new FormBuilder().group({
      defaultFolderStorageLocation: [null, [Validators.required]],
      defaultFolderBackupStorageLocation: [null],
    }, {validator: this.differentFolderStorageValidator()});
  }

  private static differentFolderStorageValidator(): ValidatorFn {
    return (control: FormGroup<CaSpaceUpdateStorageLocationDTO>): { [key: string]: any } => {
      if (control.value.defaultFolderStorageLocation == null || control.value.defaultFolderBackupStorageLocation == null) return null;

      if (control.value.defaultFolderStorageLocation.bucketId === control.value.defaultFolderBackupStorageLocation.bucketId) {
        return {sameBackupStorage: true};
      }
      return null;
    };
  }
}
