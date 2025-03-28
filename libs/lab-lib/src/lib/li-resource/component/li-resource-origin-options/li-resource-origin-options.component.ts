import { AfterViewInit, Component, inject } from '@angular/core';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { LiResourceOrigin } from '@monorepo/lab-lib/li-core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-resource-origin-options',
  templateUrl: './li-resource-origin-options.component.html',
  styleUrls: ['./li-resource-origin-options.component.scss'],
  imports: [MatOption, TranslatePipe],
})
export class LiResourceOriginOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements AfterViewInit
{
  select: MatSelect;

  originOptions: LiResourceOrigin[] = ['UPLOADED', 'GENERATED', 'IMPORTED_FROM_LAB', 'S3_FOLDER_STORAGE'];

  constructor() {
    const select = inject(MatSelect, { host: true, optional: true });

    super(select);

    this.select = select;
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
