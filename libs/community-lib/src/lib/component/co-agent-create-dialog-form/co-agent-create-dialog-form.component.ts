import { ChangeDetectionStrategy,Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { CoCreateAgentFormData } from '../../model/co-agent.class';
import { CoSpace } from '../../model/co-space.class';
import { CoConfig } from '../../service/co-service-config.config';

@Component({
  selector: 'co-agent-create-dialog-form',
  templateUrl: './co-agent-create-dialog-form.component.html',
  styleUrl: './co-agent-create-dialog-form.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CoAgentCreateDialogFormComponent {
  private coServiceConfig = inject(CoConfig);

  @Input() spaces$: Observable<CoSpace[]>;
  @Input() formGp: UntypedFormGroup;

  @Output() submitEvent: EventEmitter<CoCreateAgentFormData> = new EventEmitter<CoCreateAgentFormData>();

  isLoading = false;

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
