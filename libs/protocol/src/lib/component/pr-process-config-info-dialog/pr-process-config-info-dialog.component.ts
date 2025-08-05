import { ArrayDataSource } from '@angular/cdk/collections';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TdConfigI } from '@monorepo/technical-doc';

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
  styleUrls: ['./pr-process-config-info-dialog.component.scss'],
  standalone: false,
})
export class PrProcessConfigInfoDialogComponent {
  columns: string[] = ['name', 'shortDescription', 'defaultValue', 'value'];
  configs: ArrayDataSource<PrConfigLine>;

  constructor() {
    const config = inject<TdConfigI>(MAT_DIALOG_DATA);

    const configs: PrConfigLine[] = [];

    for (const [key, value] of Object.entries(config.values)) {
      const spec = config.specs[key];
      configs.push({
        name: spec.human_name ?? key,
        shortDescription: spec.short_description,
        defaultValue: spec.default_value,
        value: value,
        valueIsJson: typeof value === 'object',
      });
    }

    this.configs = new ArrayDataSource(configs);
  }
}
