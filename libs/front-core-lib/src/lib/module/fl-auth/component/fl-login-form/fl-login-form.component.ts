import { Component, Input } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

/**
 * Simple component containing the login form
 */
@Component({
    selector: 'fl-login-form',
    templateUrl: './fl-login-form.component.html',
    styleUrls: ['./fl-login-form.component.scss'],
    standalone: false
})
export class FlLoginFormComponent {
  @Input() formGp: UntypedFormGroup;

  public static buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }
}
