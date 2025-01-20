import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LabTagOrigin } from '../../../../model/entities/lab-tag.entity';
import { LabTagService } from '../../../../entity-service/lab-tag.service';

/**
 * Component to show the list of tag origins
 */
@Component({
    selector: 'lab-tag-origins',
    templateUrl: './lab-tag-origins.component.html',
    styleUrl: './lab-tag-origins.component.scss',
    standalone: false
})
export class LabTagOriginsComponent implements OnInit {
  @Input({ required: true }) tagEntityId: string;

  origins$: Observable<LabTagOrigin[]>;

  constructor(private tagService: LabTagService) {}

  ngOnInit(): void {
    this.origins$ = this.tagService.getEntityTagOrigins(this.tagEntityId);
  }
}
