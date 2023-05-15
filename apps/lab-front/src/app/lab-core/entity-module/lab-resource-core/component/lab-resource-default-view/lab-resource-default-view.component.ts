import {Component, Input, OnInit} from '@angular/core';
import {distinctUntilChanged, Observable, of, switchMap} from 'rxjs';
import {LabResourceService} from '../../../../entity-service/lab-resource.service';
import {LabResourceView} from '../../../../model/entities/resource/lab-resource-view.entity';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'lab-resource-default-view',
  templateUrl: './lab-resource-default-view.component.html',
  styleUrls: ['./lab-resource-default-view.component.scss'],
})
export class LabResourceDefaultViewComponent implements OnInit {

  @Input() resourceId: string | Observable<string>;

  labView$: Observable<LabResourceView>;

  constructor(private resourceService: LabResourceService) {
  }

  ngOnInit(): void {
    const resourceId$: Observable<string> = typeof this.resourceId === 'string' ?
      of(this.resourceId) :
      this.resourceId;

    this.labView$ = resourceId$.pipe(
      distinctUntilChanged(), // don't call the service if the resourceId is the same
      switchMap((resourceId: string) =>
        this.resourceService.callResourceDefaultView(resourceId, true)),
      filter((labView: LabResourceView) => labView !== null)
    );
  }


}
