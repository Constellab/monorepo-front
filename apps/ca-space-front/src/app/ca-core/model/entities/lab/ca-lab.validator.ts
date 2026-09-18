import { AbstractControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { CaLabAdminForm } from './ca-lab.form';

/**
 * Validator for CaLab
 */
export class CaLabValidator {
  public static virtualHostDomainValidator(cloud: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: any = control.value;
      if (value == null || value.length === 0) {
        return null; // don't validate empty values to allow optional controls
      }

      if (cloud) {
        // any domain is accepted, only check that it is made of lowercase letters, numbers, '-' and '.'
        if (!value.match(/^[a-z0-9-.]+$/)) {
          return { pattern: true };
        }
      } else {
        // check that the domain is valid including possibility of subdomain and port,
        // only 1 ':' is allowed followed by a port number
        if (!value.match(/^(?:[a-z0-9-]+\.)*[a-z0-9-]+(?::\d+)?$/)) {
          return { pattern: true };
        }
      }

      return null;
    };
  }

  public static differentBackupRegionValidator(): ValidatorFn {
    return (control: UntypedFormGroup): ValidationErrors | null => {
      const value: CaLabAdminForm = control.value;
      if (!value) return null;

      const dailyBackupRegion = value.dailyBackupRegion;
      const weeklyBackupRegion = value.weeklyBackupRegion;

      if (dailyBackupRegion == null || weeklyBackupRegion == null) return null;

      if (dailyBackupRegion.id === weeklyBackupRegion.id) {
        return { sameBackupRegion: true };
      }
      return null;
    };
  }
}
