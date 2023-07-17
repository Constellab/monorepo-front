import {Component, Input} from '@angular/core';
import {Validators} from '@angular/forms';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {ClCredentials} from '@monorepo/core-lib';

/**
 * Simple component contaning the login form
 */
@Component({
  selector: 'fl-login-form',
  templateUrl: './fl-login-form.component.html',
  styleUrls: ['./fl-login-form.component.scss'],
})
export class FlLoginFormComponent {

  @Input() formGp: FormGroup<ClCredentials>;

  public static buildForm(): FormGroup<ClCredentials> {
    return new FormBuilder().group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }
}
