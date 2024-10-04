import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaActivityDatasource } from '../../../../../ca-core/model/entities/ca-activity.class';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import {
  CaActivitySearchFields
} from '../../../../../ca-core/entity-module/ca-activity-core/model/ca-activity-search.class';

@Component({
  selector: 'ca-folder-activity-page',
  templateUrl: './ca-folder-activity-page.component.html',
  styleUrls: ['./ca-folder-activity-page.component.scss'],
})
export class CaFolderActivityPageComponent implements OnInit {

  datasource: CaActivityDatasource<CaActivitySearchFields>;

  constructor(private route: ActivatedRoute,
              private folderService: CaFolderService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.init(params.id);
    });
  }

  private init(folderId: string): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) => this.folderService.searchActivity(folderId, page, size, filters),
      20, false);
  }
}
