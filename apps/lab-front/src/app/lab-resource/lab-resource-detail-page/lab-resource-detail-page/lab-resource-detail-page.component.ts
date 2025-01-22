import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LabResourceDetailComponent } from '../../../lab-core/entity-module/lab-resource-core/component/lab-resource-detail/lab-resource-detail.component';

@Component({
  selector: 'lab-resource-detail-page',
  templateUrl: './lab-resource-detail-page.component.html',
  styleUrls: ['./lab-resource-detail-page.component.scss'],
  imports: [LabResourceDetailComponent],
})
export class LabResourceDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);

  resourceId$: Observable<string>;

  ngOnInit(): void {
    this.resourceId$ = this.route.params.pipe(map((params) => params.id));
  }
}
