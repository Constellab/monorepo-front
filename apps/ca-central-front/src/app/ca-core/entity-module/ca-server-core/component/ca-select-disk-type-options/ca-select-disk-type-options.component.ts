import { AfterViewInit, Component, Host, OnInit } from '@angular/core';
import { CaDiskType } from '../../../../model/entities/server/ca-server-cloud.class';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib';
import { MatSelect } from '@angular/material/select';

@Component({
    selector: 'ca-select-disk-type-options',
    templateUrl: './ca-select-disk-type-options.component.html',
    styleUrls: ['./ca-select-disk-type-options.component.scss'],
    standalone: false
})
export class CaSelectDiskTypeOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit
{
  diskTypes = CaDiskType;

  constructor(@Host() select: MatSelect) {
    super(select);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
