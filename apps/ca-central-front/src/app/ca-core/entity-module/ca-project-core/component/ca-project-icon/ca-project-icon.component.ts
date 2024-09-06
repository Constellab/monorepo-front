import { Component, Input } from '@angular/core';
import { CaProject } from '../../../../model/entities/project/ca-project.class';

/**
 * Icon for a project if it is a parent or a leaf project
 */
@Component({
  selector: 'ca-project-icon',
  templateUrl: './ca-project-icon.component.html',
  styleUrls: ['./ca-project-icon.component.scss']
})
export class CaProjectIconComponent {

  @Input() project: CaProject;

  @Input() iconClass: string = '';
}
