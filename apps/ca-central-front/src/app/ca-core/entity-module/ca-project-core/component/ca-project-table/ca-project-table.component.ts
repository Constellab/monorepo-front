import { Component, Input } from '@angular/core';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';
import { CaProject, CaProjectDatasource } from '../../../../model/entities/project/ca-project.class';
import { CaRouterService } from '../../../../service/ca-router.service';

@Component({
  selector: 'ca-project-table',
  templateUrl: './ca-project-table.component.html',
  styleUrls: ['./ca-project-table.component.scss']
})
export class CaProjectTableComponent {

  @Input({ required: true }) datasource: CaProjectDatasource;

  @Input() columns: FlTableColumnStatic<CaProject>[] = ['code', 'title', 'status', 'leader', 'creation', 'actions'];

  constructor(private routerService: CaRouterService) {
  }

  onProjectUpdated(project: CaProject): void {
    this.datasource.updateItem(project);
  }

  onProjectDeleted(project: CaProject): void {
    this.datasource.removeItem(project);
  }

  onChildCreated(project: CaProject): void {
    this.routerService.navigateToProjectDetail(project.id);
  }

}
