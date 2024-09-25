import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { CoCreateLiveTaskFormData } from '../../model/co-live-task.class';
import { CoSpace } from '../../model/co-space.class';
import { CoConfig } from '../../service/co-service-config.config';
import { UntypedFormGroup } from '@angular/forms';


@Component({
  selector: 'co-live-task-create-dialog-form',
  templateUrl: './co-live-task-create-dialog-form.component.html',
  styleUrl: './co-live-task-create-dialog-form.component.scss'
})
export class CoLiveTaskCreateDialogFormComponent {

  @Input() spaces$: Observable<CoSpace[]>;
  @Input() formGp: UntypedFormGroup;

  @Output() submitEvent: EventEmitter<CoCreateLiveTaskFormData> = new EventEmitter<CoCreateLiveTaskFormData>();

  isLoading = false;

  constructor(private coServiceConfig: CoConfig) {
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
