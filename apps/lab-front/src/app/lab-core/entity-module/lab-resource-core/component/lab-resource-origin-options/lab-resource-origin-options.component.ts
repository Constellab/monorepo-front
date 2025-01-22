import { AfterViewInit, Component, inject } from '@angular/core';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib';
import { MatSelect } from '@angular/material/select';
import { LabResourceOrigin } from '../../../../model/entities/resource/lab-resource.entity';

@Component({
  selector: 'lab-resource-origin-options',
  templateUrl: './lab-resource-origin-options.component.html',
  styleUrls: ['./lab-resource-origin-options.component.scss'],
  standalone: false,
})
export class LabResourceOriginOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements AfterViewInit
{
  select: MatSelect;

  originOptions: LabResourceOrigin[] = ['UPLOADED', 'GENERATED', 'IMPORTED_FROM_LAB', 'S3_FOLDER_STORAGE'];

  constructor() {
    const select = inject(MatSelect, { host: true, optional: true });

    super(select);

    this.select = select;
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
