import { Component, Input, OnInit } from '@angular/core';
import { LabNote, LabNoteDatasource } from '../../../../model/entities/lab-note.entity';
import { FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { LabNoteService } from '../../../../entity-service/lab-note.service';

/**
 * Component to list in a Table the notes that use a resource
 */
@Component({
  selector: 'lab-notes-using-resource',
  templateUrl: './lab-notes-using-resource.component.html',
  styleUrls: ['./lab-notes-using-resource.component.scss']
})
export class LabNotesUsingResourceComponent implements OnInit {

  @Input() resourceId: string;

  datasource: LabNoteDatasource;

  columns: FlTableColumnStatic<LabNote>[] = ['title', 'lastModification'];

  constructor(private noteService: LabNoteService) {
  }

  ngOnInit(): void {
    this.getDatasource();
  }

  public getDatasource(): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page, pageSize) => this.noteService.getByResource(this.resourceId,
        page, pageSize),
      5
    );
  }

}
