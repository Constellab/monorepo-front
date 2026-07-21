import { ChangeDetectionStrategy,Component, Input } from '@angular/core';

import { TdTypeRefDTO } from '../../model/td-type.class';

@Component({
  selector: 'td-io-resource',
  templateUrl: './td-io-resource.component.html',
  styleUrls: ['./td-io-resource.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TdIoResourceComponent {
  @Input({ required: true }) resource: TdTypeRefDTO;
}
