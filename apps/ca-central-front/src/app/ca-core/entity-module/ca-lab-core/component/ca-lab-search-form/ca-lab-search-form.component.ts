import {Component, Input, OnInit} from '@angular/core';
import {FormControl, UntypedFormGroup} from '@angular/forms';
import {FlSearchState, FlUserConfigSearchNameMode} from '@monorepo/front-core-lib';
import {
  caLabServerTaskStatusDict,
  caLabStatusDict
} from '../../../../model/entities/lab/ca-lab.class';

export type CaLabSearchMode = 'all' | 'current-space';

@Component({
  selector: 'ca-lab-search-form',
  templateUrl: './ca-lab-search-form.component.html',
  styleUrls: ['./ca-lab-search-form.component.scss']
})
export class CaLabSearchFormComponent implements OnInit {

  @Input() mode: CaLabSearchMode;

  formGp: UntypedFormGroup;

  status = caLabStatusDict;
  serverTaskStatus = caLabServerTaskStatusDict;

  selectUserMode: FlUserConfigSearchNameMode;

  filter = new FormControl();


  constructor(private searchState: FlSearchState<any>) {
  }

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
    this.selectUserMode = this.mode === 'all' ? 'all' : 'space';
  }
}
