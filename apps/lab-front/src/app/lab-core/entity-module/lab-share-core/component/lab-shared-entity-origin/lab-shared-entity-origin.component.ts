import { Component, Input } from '@angular/core';
import { LabSharedEntity } from '../../../../model/entities/lab-share.entity';

/**
 * Component to show the origin of a shared resource.
 */
@Component({
    selector: 'lab-shared-entity-origin',
    templateUrl: './lab-shared-entity-origin.component.html',
    styleUrls: ['./lab-shared-entity-origin.component.scss'],
    standalone: false
})
export class LabSharedEntityOriginComponent {
  @Input() sharedEntity: LabSharedEntity;
}
