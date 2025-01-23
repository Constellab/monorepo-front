import { Component, inject, Input, OnInit } from '@angular/core';
import { LabNote, LabNoteDatasource } from '../../../../model/entities/lab-note.entity';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { LabNoteService } from '../../../../entity-service/lab-note.service';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { LabNoteTableComponent } from '../../../lab-note-core/component/lab-note-table/lab-note-table.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to list in a Table the notes that use a resource
 */
@Component({
  selector: 'lab-notes-using-resource',
  templateUrl: './lab-notes-using-resource.component.html',
  styleUrls: ['./lab-notes-using-resource.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    FlInfiniteScrollModule,
    LabNoteTableComponent,
    TranslatePipe,
  ],
})
export class LabNotesUsingResourceComponent implements OnInit {
  private noteService = inject(LabNoteService);

  @Input() resourceId: string;

  datasource: LabNoteDatasource;

  columns: FlTableColumnStatic<LabNote>[] = ['title', 'lastModification'];

  ngOnInit(): void {
    this.getDatasource();
  }

  public getDatasource(): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page, pageSize) => this.noteService.getByResource(this.resourceId, page, pageSize),
      5
    );
  }
}
