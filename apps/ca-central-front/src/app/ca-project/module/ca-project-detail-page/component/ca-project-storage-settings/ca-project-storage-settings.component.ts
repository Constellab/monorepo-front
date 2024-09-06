import {Component, OnInit} from '@angular/core';
import {CaProjectService} from '../../../../../ca-core/service-api/ca-project.service';
import {CaProjectDetailState} from '../../state/ca-project-detail.state';
import {firstValueFrom, mergeMap, Observable, of} from 'rxjs';
import {FlDialogService} from '@monorepo/front-core-lib';
import {
  CaProjectConfigureStorageComponent,
  CaProjectConfigureStorageInput
} from '../ca-project-configure-storage/ca-project-configure-storage.component';
import {CaProjectStorageDTO} from '../../../../../ca-core/model/entities/project/ca-project.class';

/**
 * Component to show the storage settings of the project (bucket) with possibility to configure it.
 */
@Component({
  selector: 'ca-project-storage-settings',
  templateUrl: './ca-project-storage-settings.component.html',
  styleUrls: ['./ca-project-storage-settings.component.scss']
})
export class CaProjectStorageSettingsComponent implements OnInit {

  projectBucket$: Observable<CaProjectStorageDTO>;

  constructor(private projectService: CaProjectService,
              private state: CaProjectDetailState,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    this.projectBucket$ = this.state.getFolderId$().pipe(
      mergeMap(projectId => this.projectService.getProjectStorages(projectId))
    );
  }

  async configureStorage(): Promise<void> {
    const projectId = await firstValueFrom(this.state.getFolderId$());
    const projectBucket = await firstValueFrom(this.projectBucket$);

    const input: CaProjectConfigureStorageInput = {
      mode: 'update',
      projectId: projectId,
      object: {
        mainStorage: projectBucket.mainStorage,
        backupStorage: projectBucket.backupStorage,
      }
    };
    this.dialogService.openSmallDialog(CaProjectConfigureStorageComponent, {data: input}).afterClosed().subscribe(
      bucket => this.onConfiguredClosed(bucket)
    );
  }

  private onConfiguredClosed(buckets?: CaProjectStorageDTO): void {
    if (buckets) {
      this.projectBucket$ = of(buckets);
    }
  }

}
