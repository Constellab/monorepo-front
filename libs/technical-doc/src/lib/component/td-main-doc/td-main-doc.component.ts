import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TdTypeRefDTO, TdTypeTypingEntity } from '../../model/td-type.class';

@Component({
  selector: 'td-main-doc',
  templateUrl: './td-main-doc.component.html',
  styleUrls: ['./td-main-doc.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TdMainDocComponent {
  @Input() entity: TdTypeTypingEntity;

  /**
   * The entity's parent fields (parentTypingName/parentHumanName/parentVersion) are all
   * independently optional. `td-io-resource` genuinely needs all three to render a link, so
   * this returns `null` (rather than a `TdTypeRefDTO` with dishonestly-widened fields) unless
   * they are all present.
   */
  get parentResourceRef(): TdTypeRefDTO | null {
    const { parentTypingName, parentHumanName, parentVersion, parentStyle } = this.entity;
    if (!parentTypingName || !parentHumanName || !parentVersion) return null;

    return {
      human_name: parentHumanName,
      typing_name: parentTypingName,
      brick_version: parentVersion,
      style: parentStyle,
    };
  }
}
