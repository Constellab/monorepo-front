import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TdTypeRefDTO, TdTypeTypingEntity } from '../../model/td-type.class';

// The entity's parent fields are all optional, so the ref built from them is too
type TdParentTypeRef = { [K in keyof TdTypeRefDTO]: TdTypeRefDTO[K] | undefined };

@Component({
  selector: 'td-main-doc',
  templateUrl: './td-main-doc.component.html',
  styleUrls: ['./td-main-doc.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TdMainDocComponent {
  @Input() entity: TdTypeTypingEntity;

  get parentResourceRef(): TdParentTypeRef {
    return {
      human_name: this.entity.parentHumanName,
      typing_name: this.entity.parentTypingName,
      brick_version: this.entity.parentVersion,
      style: this.entity.parentStyle,
    };
  }
}
