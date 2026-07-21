import { ChangeDetectionStrategy,Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

import { LabBiotaDatabaseSearch } from '../../../model/lab-biota-database.class';
import { LabBiotaDatabaseSelectOptionsComponent } from '../lab-biota-database-select-options/lab-biota-database-select-options.component';

@Component({
  selector: 'lab-biota-database-search-form',
  templateUrl: './lab-biota-database-search-form.component.html',
  styleUrls: ['./lab-biota-database-search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    LabBiotaDatabaseSelectOptionsComponent,
    MatError,
    MatInput,
    MatButton,
    MatIcon,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LabBiotaDatabaseSearchFormComponent {
  formGp = new FormBuilder().group({
    typingName: [null, Validators.required],
    searchText: [null, Validators.required],
  });

  @Output() searched: EventEmitter<LabBiotaDatabaseSearch> = new EventEmitter();

  submit(): void {
    if (this.formGp.valid) {
      this.searched.emit(this.formGp.getRawValue());
    }
  }
}
