import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {LabViewConfig} from '../../../../model/entities/resource/lab-view-config.entity';
import {LabViewConfigService} from '../../../../entity-service/lab-view-config.service';
import {ClHelpService} from '@monorepo/core-lib';

@Component({
  selector: 'lab-view-config-favorite',
  templateUrl: './lab-view-config-favorite.component.html',
  styleUrls: ['./lab-view-config-favorite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabViewConfigFavoriteComponent {

  @Input() viewConfig: LabViewConfig;

  @Output() update: EventEmitter<LabViewConfig> = new EventEmitter();

  private isLoading: boolean = false;

  constructor(private viewConfigService: LabViewConfigService) {
  }

  toggle(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);

    if (this.isLoading) return;

    this.viewConfig.flagged = !this.viewConfig.flagged;

    this.isLoading = true;
    this.viewConfigService.updateFlagged(this.viewConfig.id, this.viewConfig.flagged).subscribe({
      next: entity => this.onSuccess(entity),
      error: () => this.onError(this.viewConfig.flagged)
    });
  }

  private onSuccess(entity: LabViewConfig): void {
    this.isLoading = false;
    this.update.emit(entity);
  }

  private onError(highlighted: boolean): void {
    this.viewConfig.flagged = !highlighted;
    this.isLoading = false;
  }


  get fontSet(): string {
    return this.viewConfig.flagged ? 'material-icons' : 'material-icons-outlined';
  }

  get tooltip(): string {
    return this.viewConfig.flagged ? 'biox.view_favorite_tooltip' : 'biox.view_not_favorite_tooltip';
  }
}
