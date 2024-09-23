import { Component, Inject } from '@angular/core';
import { FL_PORTAL_DATA, FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { LabExperiment, LabExperimentDatasource } from '../../../../../lab-core/model/entities/lab-experiment.entity';
import { LabExperimentService } from '../../../../../lab-core/entity-service/lab-experiment.service';
import { LabNote, LabNoteDatasource } from '../../../../../lab-core/model/entities/lab-note.entity';
import { LabNoteService } from '../../../../../lab-core/entity-service/lab-note.service';

@Component({
  selector: 'lab-resource-next-objects-portal',
  templateUrl: './lab-resource-next-objects-portal.component.html',
  styleUrl: './lab-resource-next-objects-portal.component.scss'
})
export class LabResourceNextObjectsPortalComponent {

  experiments: LabExperimentDatasource;
  experimentColumns: FlTableColumnStatic<LabExperiment>[] = ['title', 'status'];

  notes: LabNoteDatasource;
  noteColumns: FlTableColumnStatic<LabNote>[] = ['title', 'lastModification'];

  constructor(@Inject(FL_PORTAL_DATA) resourceId: string,
              private experimentService: LabExperimentService,
              private noteService: LabNoteService) {
    this.experiments = new FlEntityPaginatedDatasource(
      (page, pageSize) => this.experimentService.getByInputResource(resourceId,
        page, pageSize),
      5
    );

    this.notes = new FlEntityPaginatedDatasource(
      (page, pageSize) => this.noteService.getByResource(resourceId,
        page, pageSize),
      5
    );
  }
}
