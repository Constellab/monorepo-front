import {Component, Inject} from '@angular/core';
import {FL_PORTAL_DATA, FlOverlayRef} from '@monorepo/front-core-lib';
import {LabProject} from '../../../../model/entities/lab-project.class';

export interface LabProjectSelectPortalResult {
  project?: LabProject;
}

@Component({
  selector: 'lab-project-select-portal',
  templateUrl: './lab-project-select-portal.component.html',
  styleUrls: ['./lab-project-select-portal.component.scss'],
})
export class LabProjectSelectPortalComponent {

  projects: LabProject;

  constructor(@Inject(FL_PORTAL_DATA) project: LabProject,
              private overlayRef: FlOverlayRef) {

    this.projects = project;
  }

  projectSelected(project: LabProject): void {
    const result: LabProjectSelectPortalResult = {
      project: project
    };
    this.overlayRef.dispose(result);
  }
}
