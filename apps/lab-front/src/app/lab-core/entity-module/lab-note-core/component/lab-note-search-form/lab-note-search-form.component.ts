import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlSearchState } from '@monorepo/front-core-lib';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { LabFolderSelectComponent } from '../../../lab-folder-core/component/lab-folder-select/lab-folder-select.component';
import { LabTagFiltersComponent } from '../../../lab-tag-core/component/lab-tag-filters/lab-tag-filters.component';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { FlSearchModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { MatCheckbox } from '@angular/material/checkbox';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-note-search-form',
  templateUrl: './lab-note-search-form.component.html',
  styleUrls: ['./lab-note-search-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    LabFolderSelectComponent,
    LabTagFiltersComponent,
    FlFormModule,
    FlUserModule,
    FlSearchModule,
    MatCheckbox,
    TranslatePipe,
  ],
})
export class LabNoteSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
