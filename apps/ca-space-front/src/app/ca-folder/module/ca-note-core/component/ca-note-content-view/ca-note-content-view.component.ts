import { Component, inject } from '@angular/core';
import { RvResourceView } from '@monorepo/resource-view';
import { RvResourceViewModule } from '@monorepo/resource-view';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';

@Component({
  selector: 'ca-note-content-view',
  templateUrl: './ca-note-content-view.component.html',
  styleUrls: ['./ca-note-content-view.component.scss'],
  imports: [RvResourceViewModule],
})
export class CaNoteContentViewComponent extends TeElementBlockDirective {
  private noteService = inject(CaNoteService);

  view$: Observable<RvResourceView>;

  resourceId: string;
  viewTitle: string;
  caption: string;

  constructor() {
    super();
  }

  public setViewInputs(
    noteId: string,
    viewId: string,
    title: string,
    caption: string,
    resourceId?: string
  ): void {
    this.view$ = this.noteService
      .getNoteJsonFileContent(noteId, viewId)
      .pipe(map((noteView) => noteView.view));

    this.viewTitle = title;
    this.caption = caption;
    this.resourceId = resourceId;
  }
}
