import { Component, inject } from '@angular/core';
import { FL_PORTAL_DATA, FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { LabScenario, LabScenarioDatasource } from '../../../../lab-core/model/entities/lab-scenario.entity';
import { LabScenarioService } from '../../../../lab-core/entity-service/lab-scenario.service';
import { LabNote, LabNoteDatasource } from '../../../../lab-core/model/entities/lab-note.entity';
import { LabNoteService } from '../../../../lab-core/entity-service/lab-note.service';

@Component({
  selector: 'lab-resource-next-objects-portal',
  templateUrl: './lab-resource-next-objects-portal.component.html',
  styleUrl: './lab-resource-next-objects-portal.component.scss',
  standalone: false,
})
export class LabResourceNextObjectsPortalComponent {
  private scenarioService = inject(LabScenarioService);
  private noteService = inject(LabNoteService);

  scenarios: LabScenarioDatasource;
  scenarioColumns: FlTableColumnStatic<LabScenario>[] = ['title', 'status'];

  notes: LabNoteDatasource;
  noteColumns: FlTableColumnStatic<LabNote>[] = ['title', 'lastModification'];

  constructor() {
    const resourceId = inject(FL_PORTAL_DATA);

    this.scenarios = new FlEntityPaginatedDatasource(
      (page, pageSize) => this.scenarioService.getByInputResource(resourceId, page, pageSize),
      5
    );

    this.notes = new FlEntityPaginatedDatasource(
      (page, pageSize) => this.noteService.getByResource(resourceId, page, pageSize),
      5
    );
  }
}
