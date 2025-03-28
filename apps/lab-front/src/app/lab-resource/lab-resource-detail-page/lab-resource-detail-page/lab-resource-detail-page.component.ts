import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { LiResourceDetailComponent } from '@monorepo/lab-lib/li-resource';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'lab-resource-detail-page',
  templateUrl: './lab-resource-detail-page.component.html',
  styleUrls: ['./lab-resource-detail-page.component.scss'],
  imports: [LiResourceDetailComponent],
})
export class LabResourceDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);

  resourceId$: Observable<string>;

  ngOnInit(): void {
    this.resourceId$ = this.route.params.pipe(map((params) => params.id));
  }
}
