import { Component, Input } from '@angular/core';

import { TdTypeEntity } from '../../model/td-type.class';

@Component({
  selector: 'td-technical-doc',
  templateUrl: './td-technical-doc.component.html',
  styleUrls: ['./td-technical-doc.component.scss'],
  standalone: false,
})
export class TdTechnicalDocComponent {
  @Input({ required: true }) technicalDoc: TdTypeEntity;
}
