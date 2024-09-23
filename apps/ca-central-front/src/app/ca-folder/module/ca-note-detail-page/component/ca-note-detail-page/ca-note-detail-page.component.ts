import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ca-note-detail-page',
  templateUrl: './ca-note-detail-page.component.html',
  styleUrls: ['./ca-note-detail-page.component.scss']
})
export class CaNoteDetailPageComponent implements OnInit {

  noteId$: Observable<string>;
  note$: Observable<CaNote>;

  constructor(private noteService: CaNoteService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => this.init(params.id)
    );
    this.noteId$ = this.route.params.pipe(
      map(params => params.id)
    );
  }

  private init(id: string): void {
    this.note$ = this.noteService.getById(id);
  }


}
