import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RvResourceView } from '@monorepo/resource-view';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'ca-note-content-view',
    templateUrl: './ca-note-content-view.component.html',
    styleUrls: ['./ca-note-content-view.component.scss'],
    standalone: false
})
export class CaNoteContentViewComponent extends TeElementBlockDirective {
  view$: Observable<RvResourceView>;

  resourceId: string;
  viewTitle: string;
  caption: string;

  constructor(private noteService: CaNoteService) {
    super();
  }

  public setViewInputs(
    noteId: string,
    viewId: string,
    title: string,
    caption: string,
    resourceId?: string
  ): void {
    this.view$ = this.noteService.getView(noteId, viewId).pipe(map((noteView) => noteView.view));

    this.viewTitle = title;
    this.caption = caption;
    this.resourceId = resourceId;
  }
}
