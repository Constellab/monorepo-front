import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib';
import { labBiotaDatabaseGroups } from '../../../model/lab-biota-database.class';
import { MatSelect } from '@angular/material/select';
import { MatOptgroup, MatOption } from '@angular/material/core';
import { TranslatePipe } from '@ngx-translate/core';

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
  implements OnInit, AfterViewInit
{
  private select: MatSelect;

  databaseGroups = labBiotaDatabaseGroups;

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);

    this.select = select;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
