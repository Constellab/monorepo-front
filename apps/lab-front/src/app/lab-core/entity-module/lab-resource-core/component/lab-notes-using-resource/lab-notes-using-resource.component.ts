import { Component, inject, Input, OnInit } from '@angular/core';
import { LabNote, LabNoteDatasource } from '../../../../model/entities/lab-note.entity';
import { FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { LabNoteService } from '../../../../entity-service/lab-note.service';
import { FlCardModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { FlInfiniteScrollModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
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
