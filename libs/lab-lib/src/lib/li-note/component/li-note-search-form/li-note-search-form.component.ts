import { Component, OnInit, inject } from '@angular/core';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlSearchModule, FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiFolderSelectComponent } from '@monorepo/lab-lib/li-folder';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { LiTagFiltersComponent } from '@monorepo/lab-lib/li-tag';

@Component({
  selector: 'li-note-search-form',
  templateUrl: './li-note-search-form.component.html',
  styleUrls: ['./li-note-search-form.component.scss'],
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
    LiFolderSelectComponent,
    LiTagFiltersComponent,
    FlFormModule,
    FlUserModule,
    FlSearchModule,
    MatCheckbox,
    TranslatePipe,
  ],
})
export class LiNoteSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
