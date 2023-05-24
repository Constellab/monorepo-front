import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Validator for CaLabInstance
 */
export class CaLabInstanceValidator {

  public static readonly SUPPORTED_DOMAINS = ['gencovery.io', 'constellab.app'];

  public static nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: any = control.value;
      if (value == null || value.length === 0) {
        return null;  // don't validate empty values to allow optional controls
      }


      // check that name is only alphanumeric characters and '-' and '_'. Also check that it doesn't start or end with '-' or '_'.
      if (!/^[a-zA-Z0-9_-]+$/.test(value) || /^[-_]|[-_]$/.test(value)) {
        return {pattern: true};
      }

      return null;
    };
  }

  public static virtualHostDomainValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: any = control.value;
      if (value == null || value.length === 0) {
        return null;  // don't validate empty values to allow optional controls
      }

      // check that the value is a subdomain of one of supportedDomains
      const subDomain = value.split('.')[0];
      if (subDomain.length === 0) {
        return {invalid: true};
      }

      const mainDomain = value.substring(subDomain.length + 1);
      if (CaLabInstanceValidator.SUPPORTED_DOMAINS.indexOf(mainDomain) === -1) {
        return {invalid: true};
      }

      // check that subdomain is only lowercase letters, numbers and '-'
      if (!subDomain.match(/^[a-z0-9-]+$/)) {
        return {pattern: true};
      }

      return null;
    };
  }

}
