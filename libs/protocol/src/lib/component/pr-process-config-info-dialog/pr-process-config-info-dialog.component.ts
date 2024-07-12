import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrConfig } from '../../model/pr-config.class';
import { ArrayDataSource } from '@angular/cdk/collections';

interface PrConfigLine {
  name: string;
  shortDescription?: string;
  defaultValue: string;
  value: any;
  valueIsJson: boolean;
}

/**
 * Dialog to show the detail of a config
 */
@Component({
  selector: 'pr-process-config-info-dialog',
  templateUrl: './pr-process-config-info-dialog.component.html',
  styleUrls: ['./pr-process-config-info-dialog.component.scss']
})
export class PrProcessConfigInfoDialogComponent {

  columns: string[] = ['name', 'shortDescription', 'defaultValue', 'value'];
  configs: ArrayDataSource<PrConfigLine>;

  constructor(@Inject(MAT_DIALOG_DATA) config: PrConfig) {
    const configs: PrConfigLine[] = [];

    for (const [key, value] of Object.entries(config.values)) {
      const spec = config.specs[key];
      configs.push({
        name: spec.human_name ?? key,
        shortDescription: spec.short_description,
        defaultValue: spec.default_value,
        value: value,
        valueIsJson: typeof value === 'object'
      });
    }

    this.configs = new ArrayDataSource(configs);
  }
}
