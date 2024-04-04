import {Component, OnInit} from '@angular/core';
import {mergeMap, Observable} from 'rxjs';
import {CaProjectStorageUsageDTO} from '../../../../../ca-core/model/entities/project/ca-document.class';
import {CaProjectDetailState} from '../../state/ca-project-detail.state';
import {CaProjectService} from '../../../../../ca-core/service-api/ca-project.service';

@Component({
  selector: 'ca-project-storage-usage-section',
  templateUrl: './ca-project-storage-usage-section.component.html',
  styleUrl: './ca-project-storage-usage-section.component.scss'
})
export class CaProjectStorageUsageSectionComponent implements OnInit{

  storageUsage$: Observable<CaProjectStorageUsageDTO>;

  constructor(private state: CaProjectDetailState,
              private projectService: CaProjectService) {
  }

  ngOnInit(): void {
    this.storageUsage$ = this.state.getProjectId$().pipe(
      mergeMap(projectId => this.projectService.getProjectStorageSize(projectId)),
    );
  }
}
