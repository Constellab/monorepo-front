import { Component, EventEmitter, Output } from '@angular/core';
import { LabBiotaDatabaseSearch } from '../../../model/lab-biota-database.class';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { LabBiotaDatabaseSelectOptionsComponent } from '../lab-biota-database-select-options/lab-biota-database-select-options.component';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlCorePipeModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-biota-database-search-form',
  templateUrl: './lab-biota-database-search-form.component.html',
  styleUrls: ['./lab-biota-database-search-form.component.scss'],
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

  @Output() search: EventEmitter<LabBiotaDatabaseSearch> = new EventEmitter();

  submit(): void {
    if (this.formGp.valid) {
      this.search.emit(this.formGp.getRawValue());
    }
  }
}
