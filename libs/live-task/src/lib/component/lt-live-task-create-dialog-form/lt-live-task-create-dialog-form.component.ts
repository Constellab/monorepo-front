import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from '@ngneat/reactive-forms';
import {Observable} from 'rxjs';
import {LtCreateLiveTaskFormData, LtSpace} from '../../model/lt-live-task.class';



@Component({
  selector: 'lt-live-task-create-dialog-form',
  templateUrl: './lt-live-task-create-dialog-form.component.html',
  styleUrl: './lt-live-task-create-dialog-form.component.scss',
})
export class LtLiveTaskCreateDialogFormComponent {

  @Input() spaces$: Observable<LtSpace[]>;
  @Input() formGp: FormGroup<LtCreateLiveTaskFormData>;

  @Output() submitEvent: EventEmitter<LtCreateLiveTaskFormData> = new EventEmitter<LtCreateLiveTaskFormData>();

  isLoading = false;

  constructor() {
  }

  submit(): void {
    if (this.formGp.valid) {
      this.isLoading = true;
      this.submitEvent.emit(this.formGp.value);
    }
  }
}
