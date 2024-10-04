import { Component, Inject } from '@angular/core';
import { FL_PORTAL_DATA, FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { LabScenario, LabScenarioDatasource } from '../../../../lab-core/model/entities/lab-scenario.entity';
import { LabScenarioService } from '../../../../lab-core/entity-service/lab-scenario.service';
import { LabNote, LabNoteDatasource } from '../../../../lab-core/model/entities/lab-note.entity';
import { LabNoteService } from '../../../../lab-core/entity-service/lab-note.service';

@Component({
  selector: 'lab-resource-next-objects-portal',
  templateUrl: './lab-resource-next-objects-portal.component.html',
  styleUrl: './lab-resource-next-objects-portal.component.scss'
})
export class LabResourceNextObjectsPortalComponent {

  scenarios: LabScenarioDatasource;
  scenarioColumns: FlTableColumnStatic<LabScenario>[] = ['title', 'status'];

  notes: LabNoteDatasource;
  noteColumns: FlTableColumnStatic<LabNote>[] = ['title', 'lastModification'];

  constructor(@Inject(FL_PORTAL_DATA) resourceId: string,
              private scenarioService: LabScenarioService,
              private noteService: LabNoteService) {
    this.scenarios = new FlEntityPaginatedDatasource(
      (page, pageSize) => this.scenarioService.getByInputResource(resourceId,
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
