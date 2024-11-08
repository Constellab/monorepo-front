import { Component, Input } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FlGlobalValidators } from '../../../../utils/fl-global.validators';

/**
 * Component that contains the form to create a new user
 */
@Component({
  selector: 'fl-signup-form',
  templateUrl: './fl-signup-form.component.html',
  styleUrls: ['./fl-signup-form.component.scss'],
})
export class FlSignupFormComponent {
  @Input() formGp: UntypedFormGroup;

  public static buildFormGroup(): UntypedFormGroup {
    return new FormBuilder().group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, FlGlobalValidators.passwordValidator()]],
      repeatPassword: [null, [Validators.required, FlGlobalValidators.repeatPasswordValidator('password')]],
      validateCGU: [false, FlGlobalValidators.isValue(true)],
      phone: [null],
    });
  }

  // update the repeat password validity on password change
  updateRepeatPasswordValidity(): void {
    this.formGp.get('repeatPassword').updateValueAndValidity();
  }
}
