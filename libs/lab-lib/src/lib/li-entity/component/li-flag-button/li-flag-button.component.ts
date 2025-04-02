import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';
import { LiFlaggedEntity, LiResource, LiResourceService } from '@monorepo/lab-lib/li-core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Button to toggle the flag of an element.
 */
@Component({
  selector: 'li-flag-button',
  templateUrl: './li-flag-button.component.html',
  styleUrls: ['./li-flag-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconButton, MatTooltip, MatIcon, TranslatePipe],
})
export class LiFlagButtonComponent {
  private resourceService = inject(LiResourceService);

  @Input() entity: LiFlaggedEntity;

  @Output() update: EventEmitter<LiFlaggedEntity> = new EventEmitter();

  private isLoading: boolean = false;

  toggleHighlight(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);

    if (this.isLoading) return;

    this.entity.flagged = !this.entity.flagged;
    let obs: Observable<LiFlaggedEntity> = null;
    if (this.entity instanceof LiResource) {
      obs = this.resourceService.updateFlagged(this.entity.id, this.entity.flagged);
    } else {
      console.error('[LabHighlightButtonComponent] type is not supported');
      return;
    }

    this.isLoading = true;
    obs.subscribe({
      next: (entity) => this.onSuccess(entity),
      error: () => this.onError(this.entity.flagged),
    });
  }

  private onSuccess(entity: LiFlaggedEntity): void {
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
    if (this.entity instanceof LiResource) {
      return this.entity.flagged ? 'li.resource_flagged_tooltip' : 'li.resource_not_flagged_tooltip';
    } else {
      console.error('[LiFlagButtonComponent] Object type unknown');
      return '';
    }
  }
}
