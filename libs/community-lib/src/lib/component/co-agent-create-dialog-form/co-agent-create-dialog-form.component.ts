import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { CoCreateAgentFormData } from '../../model/co-agent.class';
import { CoSpace } from '../../model/co-space.class';
import { CoConfig } from '../../service/co-service-config.config';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'co-agent-create-dialog-form',
  templateUrl: './co-agent-create-dialog-form.component.html',
  styleUrl: './co-agent-create-dialog-form.component.scss',
})
export class CoAgentCreateDialogFormComponent {
  @Input() spaces$: Observable<CoSpace[]>;
  @Input() formGp: UntypedFormGroup;

  @Output() submitEvent: EventEmitter<CoCreateAgentFormData> = new EventEmitter<CoCreateAgentFormData>();

  isLoading = false;

  constructor(private coServiceConfig: CoConfig) {}

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
