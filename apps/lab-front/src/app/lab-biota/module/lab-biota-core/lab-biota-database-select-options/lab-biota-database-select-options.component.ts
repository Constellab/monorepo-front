import { AfterViewInit, Component, inject } from '@angular/core';
import { MatOptgroup, MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { TranslatePipe } from '@ngx-translate/core';

import { labBiotaDatabaseGroups } from '../../../model/lab-biota-database.class';

/**
 * Component to be placed under a select or autocomplete to list biota database options
 */
@Component({
  selector: 'lab-biota-database-select-options',
  templateUrl: './lab-biota-database-select-options.component.html',
  styleUrls: ['./lab-biota-database-select-options.component.scss'],
  imports: [MatOptgroup, MatOption, TranslatePipe],
})
export class LabBiotaDatabaseSelectOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements AfterViewInit
{
  private select: MatSelect;

  databaseGroups = labBiotaDatabaseGroups;

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);

    this.select = select;
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
