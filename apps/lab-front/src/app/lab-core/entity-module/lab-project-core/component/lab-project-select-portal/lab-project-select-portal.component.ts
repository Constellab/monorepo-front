import {Component, Inject} from '@angular/core';
import {FL_PORTAL_DATA, FlOverlayRef} from '@monorepo/front-core-lib';
import {LabProject} from '../../../../model/entities/lab-project.class';


export interface LabProjectSelectPortalInput {
  project?: LabProject;
  helpText?: string;
}

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
  helpText: string;

  constructor(@Inject(FL_PORTAL_DATA) data: LabProjectSelectPortalInput,
              private overlayRef: FlOverlayRef) {

    this.projects = data.project;
    this.helpText = data.helpText;
  }

  projectSelected(project: LabProject): void {
    const result: LabProjectSelectPortalResult = {
      project: project
    };
    this.overlayRef.dispose(result);
  }
}
