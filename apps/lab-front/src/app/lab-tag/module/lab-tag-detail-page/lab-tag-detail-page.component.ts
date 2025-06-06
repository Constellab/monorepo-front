import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { LiTagDetailComponent } from '@monorepo/lab-lib/li-tag';

@Component({
  selector: 'lab-tag-detail-page',
  imports: [LiTagDetailComponent],
  templateUrl: './lab-tag-detail-page.component.html',
  styleUrl: './lab-tag-detail-page.component.scss',
})
export class LabTagDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);

  tagKey$: Observable<string>;

  ngOnInit(): void {
    this.tagKey$ = this.route.params.pipe(map((params) => params.key));
  }
}
