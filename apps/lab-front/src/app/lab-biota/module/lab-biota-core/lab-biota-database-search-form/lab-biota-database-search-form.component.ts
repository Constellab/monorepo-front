import { Component, EventEmitter, Output } from '@angular/core';
import { LabBiotaDatabaseSearch } from '../../../model/lab-biota-database.class';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'lab-biota-database-search-form',
  templateUrl: './lab-biota-database-search-form.component.html',
  styleUrls: ['./lab-biota-database-search-form.component.scss'],
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
