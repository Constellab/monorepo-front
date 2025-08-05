import { Component, inject,Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { LiBricksSelectOptionsComponent } from '@monorepo/lab-lib/li-brick';
import { LiTypeSearchConfig } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-type-search-form',
  templateUrl: './li-type-search-form.component.html',
  styleUrls: ['./li-type-search-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    LiBricksSelectOptionsComponent,
    MatOption,
    MatCheckbox,
    TranslatePipe,
  ],
})
export class LiTypeSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  @Input() config: LiTypeSearchConfig;

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }

  get showObjectSubTypeField(): boolean {
    return this.config.mode === 'process';
  }

  get showImporterIgnoreExtensionField(): boolean {
    return this.config.mode === 'importer';
  }
}
