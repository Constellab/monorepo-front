import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {LabFlaggedEntity} from '../../../../model/global/lab-flagged-entity.class';
import {LabViewConfigService} from '../../../../entity-service/lab-view-config.service';
import {LabViewConfig} from '../../../../model/entities/resource/lab-view-config.entity';
import {ClHelpService} from '@monorepo/core-lib';
import {LabResource} from '../../../../model/entities/resource/lab-resource.entity';
import {LabResourceService} from '../../../../entity-service/lab-resource.service';
import {Observable} from 'rxjs';

/**
 * Button to toggle the flag of an element.
 */
@Component({
  selector: 'lab-flag-button',
  templateUrl: './lab-flag-button.component.html',
  styleUrls: ['./lab-flag-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabFlagButtonComponent {

  @Input() entity: LabFlaggedEntity;

  @Output() update: EventEmitter<LabFlaggedEntity> = new EventEmitter();

  private isLoading: boolean = false;

  constructor(private viewConfigService: LabViewConfigService,
              private resourceService: LabResourceService) {
  }

  toggleHighlight(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);

    if (this.isLoading) return;

    this.entity.flagged = !this.entity.flagged;
    let obs: Observable<LabFlaggedEntity> = null;
    if (this.entity instanceof LabViewConfig) {
      obs = this.viewConfigService.updateFlagged(this.entity.id, this.entity.flagged);
    } else if (this.entity instanceof LabResource) {
      obs = this.resourceService.updateFlagged(this.entity.id, this.entity.flagged);
    } else {
      console.error('[LabHighlightButtonComponent] type is not supported');
      return;
    }

    this.isLoading = true;
    obs.subscribe({
      next: entity => this.onSuccess(entity),
      error: () => this.onError(this.entity.flagged)
    });
  }

  private onSuccess(entity: LabFlaggedEntity): void {
    this.isLoading = false;
    this.update.emit(entity);
  }

  private onError(highlighted: boolean): void {
    this.entity.flagged = !highlighted;
    this.isLoading = false;
  }


  get fontSet(): string {
    return this.entity.flagged ? 'material-icons' : 'material-icons-outlined';
  }

  get tooltip(): string {
    if (this.entity instanceof LabViewConfig) {
      return this.entity.flagged ? 'biox.view_favorite_tooltip' : 'biox.view_not_favorite_tooltip';
    } else if (this.entity instanceof LabResource) {
      return this.entity.flagged ? 'biox.resource_flagged_tooltip' : 'biox.resource_not_flagged_tooltip';
    } else {
      console.error('[LabFlagButtonComponent] Object type unknown');
      return '';
    }
  }

}

