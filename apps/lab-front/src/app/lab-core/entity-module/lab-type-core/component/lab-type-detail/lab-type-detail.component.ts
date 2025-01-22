import { Component, Input } from '@angular/core';
import { LabTypeEntity } from '../../../../model/entities/lab-type/lab-type.entity';
import { TdTechnicalDocModule } from '../../../../../../../../../libs/technical-doc/src/lib/td-technical-doc.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';

/**
 * Component to show the detail of a type (resource, task or protocol)
 */
@Component({
  selector: 'lab-type-detail',
  templateUrl: './lab-type-detail.component.html',
  styleUrls: ['./lab-type-detail.component.scss'],
  imports: [TdTechnicalDocModule, FlCorePipeModule],
})
export class LabTypeDetailComponent {
  @Input() type: LabTypeEntity;
}
