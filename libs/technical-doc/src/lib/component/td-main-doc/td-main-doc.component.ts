import {Component, Input} from '@angular/core';
import {TdTypeEntity, TdTypeRefDTO} from '../../model/td-type.class';

@Component({
  selector: 'td-main-doc',
  templateUrl: './td-main-doc.component.html',
  styleUrls: ['./td-main-doc.component.scss'],
})
export class TdMainDocComponent {

  @Input() entity: TdTypeEntity;

  get parentResourceRef(): TdTypeRefDTO {
    return {
      human_name: this.entity.parentHumanName,
      typing_name: this.entity.parentTypingName,
      brick_version: this.entity.parentVersion,
      style: this.entity.parentStyle
    };
  }
}
