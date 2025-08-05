import { AfterViewInit, Component, inject } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';

import { CaDiskType } from '../../../../model/entities/server/ca-server-cloud.class';

@Component({
  selector: 'ca-select-disk-type-options',
  templateUrl: './ca-select-disk-type-options.component.html',
  styleUrls: ['./ca-select-disk-type-options.component.scss'],
  imports: [MatOption, FlCorePipeModule],
})
export class CaSelectDiskTypeOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements AfterViewInit
{
  diskTypes = CaDiskType;

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
