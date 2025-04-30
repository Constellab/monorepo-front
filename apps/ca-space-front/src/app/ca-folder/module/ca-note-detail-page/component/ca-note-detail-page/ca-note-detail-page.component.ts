import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { CaHierarchyObjectBreadcrumbComponent } from '../../../ca-folder-hierarchy-core/component/ca-hierarchy-object-breadcrumb/ca-hierarchy-object-breadcrumb.component';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { CaNoteDetailComponent } from '../ca-note-detail/ca-note-detail.component';

@Component({
  selector: 'ca-note-detail-page',
  templateUrl: './ca-note-detail-page.component.html',
  styleUrls: ['./ca-note-detail-page.component.scss'],
  imports: [CaHierarchyObjectBreadcrumbComponent, FlSectionModule, CaNoteDetailComponent],
})
export class CaNoteDetailPageComponent implements OnInit {
  private noteService = inject(CaNoteService);
  private route = inject(ActivatedRoute);

  noteId$: Observable<string>;
  note$: Observable<CaNote>;

  ngOnInit(): void {
    this.route.params.subscribe((params) => this.init(params.id));
    this.noteId$ = this.route.params.pipe(map((params) => params.id));
  }

  private init(id: string): void {
    this.note$ = this.noteService.getById(id);
  }
}
