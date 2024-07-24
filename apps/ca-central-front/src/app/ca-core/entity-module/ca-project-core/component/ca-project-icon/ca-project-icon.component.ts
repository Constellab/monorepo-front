import { Component, Input } from '@angular/core';
import { CaProject, CaProjectLevelStatus } from '../../../../model/entities/project/ca-project.class';

/**
 * Icon for a project if it is a parent or a leaf project
 */
@Component({
  selector: 'ca-project-icon',
  templateUrl: './ca-project-icon.component.html',
  styleUrls: ['./ca-project-icon.component.scss']
})
export class CaProjectIconComponent {

  @Input() type: CaProjectLevelStatus;

  @Input() project: CaProject;

  @Input() iconClass: string = '';

  get projectType(): 'parent' | 'leaf' {
    if (this.type) {
      return this.type === CaProjectLevelStatus.PARENT ? 'parent' : 'leaf';
    }
    return this.project.isLeaf() ? 'leaf' : 'parent';
  }

  get projectIcon(): string {
    return this.projectType === 'leaf' ? 'project' : 'folder';
  }

  get backgroundClass(): string {
    return this.projectType === 'leaf' ? 'g-warn-background' : 'g-accent-background';
  }

}
