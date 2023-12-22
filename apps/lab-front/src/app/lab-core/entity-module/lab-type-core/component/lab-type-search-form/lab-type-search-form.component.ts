import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {FlSearchState} from '@monorepo/front-core-lib';
import {LabTypeSearchConfig} from '../../model/lab-type-search.class';

@Component({
  selector: 'lab-type-search-form',
  templateUrl: './lab-type-search-form.component.html',
  styleUrls: ['./lab-type-search-form.component.scss']
})
export class LabTypeSearchFormComponent implements OnInit {

  @Input() config: LabTypeSearchConfig;

  formGp: UntypedFormGroup;

  constructor(private searchState: FlSearchState<any>) {
  }

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
