import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { CaDiskType } from '../../../../model/entities/server/ca-server-cloud.class';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';

@Component({
  selector: 'ca-select-disk-type-options',
  templateUrl: './ca-select-disk-type-options.component.html',
  styleUrls: ['./ca-select-disk-type-options.component.scss'],
  imports: [MatOption, FlCorePipeModule],
})
export class CaSelectDiskTypeOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit
{
  diskTypes = CaDiskType;

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
