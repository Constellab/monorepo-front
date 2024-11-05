import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
  CaBucketContentType,
  CaBucketType,
} from '../../../../ca-core/model/entities/ca-object-storage.class';
import { FlSearchState } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-bucket-search-form',
  templateUrl: './ca-bucket-search-form.component.html',
  styleUrls: ['./ca-bucket-search-form.component.scss'],
})
export class CaBucketSearchFormComponent implements OnInit {
  formGp: UntypedFormGroup;

  contentTypes = CaBucketContentType;
  bucketTypes = CaBucketType;

  constructor(private searchState: FlSearchState<any>) {}

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
