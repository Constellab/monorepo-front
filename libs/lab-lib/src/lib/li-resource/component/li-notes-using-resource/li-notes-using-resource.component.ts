import { ChangeDetectionStrategy,Component, inject, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiNote, LiNoteDatasource, LiNoteService } from '@monorepo/lab-lib/li-core';
import { LiNoteTableComponent } from '@monorepo/lab-lib/li-note';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to list in a Table the notes that use a resource
 */
@Component({
  selector: 'li-notes-using-resource',
  templateUrl: './li-notes-using-resource.component.html',
  styleUrls: ['./li-notes-using-resource.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    FlInfiniteScrollModule,
    LiNoteTableComponent,
    TranslatePipe,
  ],
})
export class LiNotesUsingResourceComponent implements OnInit {
  private noteService = inject(LiNoteService);

  @Input() resourceId: string;

  datasource: LiNoteDatasource;

  columns: FlTableColumnStatic<LiNote>[] = ['title', 'lastModification'];

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
