import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CaProject, CaProjectDatasource } from '../../../../model/entities/project/ca-project.class';
import { CaProjectService } from '../../../../service-api/ca-project.service';
import { CaAuthenticatedUserService } from '../../../../service-api/ca-authenticated-user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlSnackBarService, FlTableColumnStatic, FlTranslatableText } from '@monorepo/front-core-lib';
import { ClHelpService } from '@monorepo/core-lib';

export interface CaSelectProjectDialogInput {
  /**
   * Mode for the project selection
   * root: only root project can be selected
   * leaf: only leaf project can be selected
   * any: any project can be selected
   */
  mode: 'root' | 'leaf' | 'any';

  title: FlTranslatableText;

  // use to initialize the dialog with a project
  currentProjectId?: string;
}

/**
 * Dialog to select a project starting from the root project and navigating into subproject
 */
@Component({
  selector: 'ca-select-project-dialog',
  templateUrl: './ca-select-project-dialog.component.html',
  styleUrl: './ca-select-project-dialog.component.scss'
})
export class CaSelectProjectDialogComponent implements OnInit, OnDestroy {

  projectsDatasource: CaProjectDatasource;

  columns: FlTableColumnStatic<CaProject>[] = ['code', 'status', 'leader'];

  // contains the list of parent project for the breadcrumbs
  parentProjects: CaProject[] = null;
  selectedProject: CaProject;

  dialogInput: CaSelectProjectDialogInput = inject(MAT_DIALOG_DATA);

  constructor(private dialogRef: MatDialogRef<CaSelectProjectDialogComponent>,
              private projectService: CaProjectService,
              private authenticatedUserService: CaAuthenticatedUserService,
              private snackBarService: FlSnackBarService) {
  }

  ngOnInit(): void {
    // for any mode, we add a custom template column to add a button to zoom to project
    if (!this.isRootMode()) {
      this.columns.push('customAction');
    }

    if (this.dialogInput.currentProjectId) {
      this.initForProject(this.dialogInput.currentProjectId);
    } else {
      this.initRoots();
    }
  }

  private initForProject(projectId: string): void {
    this.projectService.getProjectAncestors(projectId).subscribe(
      ancestors => this.initParentProjects(ancestors)
    );
  }

  private initParentProjects(ancestors: CaProject[]): void {
    if (ancestors.length === 0) {
      this.initRoots();
      return;
    }

    this.selectedProject = ancestors.shift();

    if (this.selectedProject.isRoot()) {
      this.initRoots();
    } else {
      this.getChildren(this.selectedProject.parentId);
      this.parentProjects = ancestors.reverse();
    }
  }

  initRoots(): void {
    if (this.authenticatedUserService.isCurrentSpaceAdmin()) {
      this.projectsDatasource = this.projectService.getProjectByCurrentSpaceDatasource();
    } else {
      this.projectsDatasource = this.projectService.getMyProjectsDatasource();
    }
    this.parentProjects = [];
  }

  moveToRoot(): void {
    // to prevent reload when init is recall
    if (ClHelpService.isEmptyArray(this.parentProjects)) return;
    this.initRoots();
    this.selectedProject = null;
  }

  selectProject(project: CaProject): void {
    this.selectedProject = project;
  }

  projectDblClicked(project: CaProject): void {
    if (project.isLeaf() || this.isRootMode()) {
      this.selectProject(project);
      this.close();
    } else {
      this.openProject(project);
    }
  }

  openProject(project: CaProject): void {
    if (!project.isLeaf() && !this.isRootMode()) {
      this.getChildren(project.id);
      this.parentProjects.push(project);
    }

    this.selectedProject = project;
  }

  selectParentProject(parentProject: CaProject): void {
    // if the last parent is selected, do nothing it is already selected
    if (this.parentProjects[this.parentProjects.length - 1].id === parentProject.id) {
      return;
    }

    this.getChildren(parentProject.id);
    // update the list of parent
    const index = this.parentProjects.findIndex(p => p.id === parentProject.id);
    this.parentProjects = this.parentProjects.slice(0, index + 1);
    this.selectedProject = parentProject;

  }

  private getChildren(projectId: string): void {
    if (this.projectsDatasource) {
      this.projectsDatasource.clear();
    }
    this.projectsDatasource = this.projectService.getChildrenDatasource(projectId);
  }

  close(): void {
    if (this.dialogInput.mode === 'leaf' && this.selectedProject && !this.selectedProject.isLeaf()) {
      this.snackBarService.openErrorMessage({ text: 'select_project_not_leaf_error', translateText: true });
      return;
    }
    this.dialogRef.close(this.selectedProject);
  }

  isRootMode(): boolean {
    return this.dialogInput.mode === 'root';
  }

  ngOnDestroy(): void {
    this.projectsDatasource?.disconnect();
  }
}
