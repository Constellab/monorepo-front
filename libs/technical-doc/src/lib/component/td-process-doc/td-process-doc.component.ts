import { ChangeDetectionStrategy,Component, Input } from '@angular/core';

import { TdProcessType } from '../../model/td-process-type.class';

@Component({
  selector: 'td-process-doc',
  templateUrl: './td-process-doc.component.html',
  styleUrls: ['./td-process-doc.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TdProcessDocComponent {
  @Input() process: TdProcessType;
}
