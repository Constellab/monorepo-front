import { ChangeDetectionStrategy,Component, Input } from '@angular/core';

import { TdTypeOtherClass } from '../../model/td-type-other-class.class';

@Component({
  selector: 'td-other-class-doc',
  templateUrl: './td-other-class-doc.component.html',
  styleUrls: ['./td-other-class-doc.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TdOtherClassDocComponent {
  @Input({ required: true }) otherClass: TdTypeOtherClass;
}
