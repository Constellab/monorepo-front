import { AfterViewInit, Component, Host, Optional } from '@angular/core';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib';
import { MatSelect } from '@angular/material/select';
import { LabResourceOrigin } from '../../../../model/entities/resource/lab-resource.entity';

@Component({
  selector: 'lab-resource-origin-options',
  templateUrl: './lab-resource-origin-options.component.html',
  styleUrls: ['./lab-resource-origin-options.component.scss'],
})
export class LabResourceOriginOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements AfterViewInit
{
  originOptions: LabResourceOrigin[] = ['UPLOADED', 'GENERATED', 'IMPORTED_FROM_LAB', 'S3_FOLDER_STORAGE'];

  constructor(@Host() @Optional() public select: MatSelect) {
    super(select);
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
