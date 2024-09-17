import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormGroup } from '@ngneat/reactive-forms';
import { CaLabInstanceAdminForm } from './ca-lab-instance.form';

/**
 * Validator for CaLabInstance
 */
export class CaLabInstanceValidator {

  public static readonly SUPPORTED_DOMAINS = ['gencovery.io', 'constellab.app'];

  public static virtualHostDomainValidator(cloud: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: any = control.value;
      if (value == null || value.length === 0) {
        return null;  // don't validate empty values to allow optional controls
      }

      if (cloud) {
        // check that the value is a subdomain of one of supportedDomains
        const subDomain = value.split('.')[0];
        if (subDomain.length === 0) {
          return {invalid: true};
        }

        const mainDomain = value.substring(subDomain.length + 1);
        if (cloud && CaLabInstanceValidator.SUPPORTED_DOMAINS.indexOf(mainDomain) === -1) {
          return {invalid: true};
        }

        // check that subdomain is only lowercase letters, numbers '-' and '.'
        if (!value.match(/^[a-z0-9-.]+$/)) {
          return {pattern: true};
        }
      } else {

        // check that the domain is valid including possibility of subdomain and port, only 1 ':' is allowed followed by a port number
        if (!value.match(/^(?:[a-z0-9-]+\.)*[a-z0-9-]+(?::\d+)?$/)) {
          return {pattern: true};
        }
      }


      return null;
    };
  }

  public static differentBackupRegionValidator(): ValidatorFn {
    return (control: FormGroup<CaLabInstanceAdminForm>): { [key: string]: any } => {
      if (!control.value) return null;

      const dailyBackupRegion = control.value.dailyBackupRegion;
      const weeklyBackupRegion = control.value.weeklyBackupRegion;

      if (dailyBackupRegion == null || weeklyBackupRegion == null) return null;

      if (dailyBackupRegion.id === weeklyBackupRegion.id) {
        return { sameBackupRegion: true };
      }
      return null;
    };
  }

}
