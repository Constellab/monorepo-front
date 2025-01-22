import { Component, Input, OnInit, inject } from '@angular/core';
import { FlSearchState } from '@monorepo/front-core-lib';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'lab-view-config-search-form',
  templateUrl: './lab-view-config-search-form.component.html',
  styleUrls: ['./lab-view-config-search-form.component.scss'],
  standalone: false,
})
export class LabViewConfigSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  @Input() showFolderFilter: boolean = true;

  formGp: FormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
