import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FlTableColumnStatic, FlViewContext } from '@monorepo/front-core-lib';
import { CaProject, CaProjectDatasource } from '../../../../model/entities/project/ca-project.class';
import { CaRouterService } from '../../../../service/ca-router.service';
import { CaProjectActionEvent } from '../ca-project-actions-menu/ca-project-actions-menu.component';

@Component({
  selector: 'ca-project-table',
  templateUrl: './ca-project-table.component.html',
  styleUrls: ['./ca-project-table.component.scss']
})
export class CaProjectTableComponent {

  @Input({ required: true }) datasource: CaProjectDatasource;

  @Input() columns: FlTableColumnStatic<CaProject>[] = ['code', 'leader', 'creation', 'actions'];

  // when true, the row become clickable and projectClicked or projectDblClicked event is trigger
  @Input() rowSelectable: boolean = false;

  @Input() selectedProject: CaProject;
  @Output() selectedProjectChange: EventEmitter<CaProject> = new EventEmitter();

  @Output() projectDblClicked: EventEmitter<CaProject> = new EventEmitter();

  // to support custom column
  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;


  constructor(private routerService: CaRouterService) {
  }

  onProjectAction(projectEvent: CaProjectActionEvent): void {
    if (projectEvent.action === 'update') {
      this.datasource.updateItem(projectEvent.project);
    } else if (projectEvent.action === 'delete') {
      this.datasource.removeItemById(projectEvent.project.id);
    } else if (projectEvent.action === 'createChild') {
      this.routerService.navigateToProjectDetail(projectEvent.project.id);
    }
  }

  onProjectClick(project: CaProject): void {
    if (this.rowSelectable) {
      this.selectedProject = project;
      this.selectedProjectChange.next(project);
    }
  }

  onProjectDblClick(project: CaProject): void {
    if (this.rowSelectable) {
      this.projectDblClicked.next(project);
    }
  }

  getViewContent(project: CaProject): FlViewContext<CaProject> {
    return { $implicit: project };
  }

}
