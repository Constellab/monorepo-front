import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { FlSearchState, FlUserConfigSearchNameMode } from '@monorepo/front-core-lib';
import { caLabServerTaskStatusDict, caLabStatusDict } from '../../../../model/entities/lab/ca-lab.class';

export type CaLabSearchMode = 'all' | 'current-space';

@Component({
  selector: 'ca-lab-search-form',
  templateUrl: './ca-lab-search-form.component.html',
  styleUrls: ['./ca-lab-search-form.component.scss'],
  standalone: false,
})
export class CaLabSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  @Input() mode: CaLabSearchMode;

  formGp: UntypedFormGroup;

  status = caLabStatusDict;
  serverTaskStatus = caLabServerTaskStatusDict;

  selectUserMode: FlUserConfigSearchNameMode;

  filter = new FormControl();

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
    this.selectUserMode = this.mode === 'all' ? 'all' : 'space';
  }
}
