import { FormBuilder, FormGroup } from '@angular/forms';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { LiLabEnvironment, LiLabMode } from '@monorepo/lab-lib/li-core';

export class LiLabSearchFields {
  name: string;
  mode: LiLabMode;
  environment: LiLabEnvironment;
  domain: string;
}

export class LiLabSearch {
  public static searchManagerConfig: FlFormInputsManagerConfig<LiLabSearchFields> = {
    name: 'li.name',
    mode: 'li.lab_mode',
    environment: 'li.lab_environment',
    domain: 'li.lab_domain',
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<LiLabSearchFields> = {
    name: { key: 'name', operator: 'CONTAINS' },
    mode: { key: 'mode', operator: 'EQ' },
    environment: { key: 'environment', operator: 'EQ' },
    domain: { key: 'domain', operator: 'CONTAINS' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    environment: 'environment',
    domain: 'domain',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      name: [null],
      mode: [null],
      environment: [null],
      domain: [null],
    });
  }
}
