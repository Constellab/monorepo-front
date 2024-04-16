import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from '@ngneat/reactive-forms';
import {Observable} from 'rxjs';
import {CoCreateLiveTaskFormData} from '../../model/co-live-task.class';
import {CoSpace} from '../../model/co-space.class';
import {CoServiceConfig} from '../../service/co-service-config.config';



@Component({
  selector: 'co-live-task-create-dialog-form',
  templateUrl: './co-live-task-create-dialog-form.component.html',
  styleUrl: './co-live-task-create-dialog-form.component.scss',
})
export class CoLiveTaskCreateDialogFormComponent {

  @Input() spaces$: Observable<CoSpace[]>;
  @Input() formGp: FormGroup<CoCreateLiveTaskFormData>;

  @Output() submitEvent: EventEmitter<CoCreateLiveTaskFormData> = new EventEmitter<CoCreateLiveTaskFormData>();

  isLoading = false;

  constructor(private coServiceConfig: CoServiceConfig) {
  }

  submit(): void {
    if (this.formGp.valid) {
      this.isLoading = true;
      this.submitEvent.emit(this.formGp.value);
    }
  }

  getSpacePhoto(photo: string): string {
    return this.coServiceConfig.getSpacePhotoUrl(photo);
  }
}
