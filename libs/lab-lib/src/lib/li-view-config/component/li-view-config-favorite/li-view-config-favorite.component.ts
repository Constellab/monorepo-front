import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';
import { LiViewConfig, LiViewConfigService } from '@monorepo/lab-lib/li-core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-view-config-favorite',
  templateUrl: './li-view-config-favorite.component.html',
  styleUrls: ['./li-view-config-favorite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconButton, MatTooltip, MatIcon, TranslatePipe],
})
export class LiViewConfigFavoriteComponent {
  private viewConfigService = inject(LiViewConfigService);

  @Input() viewConfig: LiViewConfig;

  @Output() update: EventEmitter<LiViewConfig> = new EventEmitter();

  private isLoading: boolean = false;

  toggle(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);

    if (this.isLoading) return;

    this.viewConfig.isFavorite = !this.viewConfig.isFavorite;

    this.isLoading = true;
    this.viewConfigService.updateFavorite(this.viewConfig.id, this.viewConfig.isFavorite).subscribe({
      next: (entity) => this.onSuccess(entity),
      error: () => this.onError(this.viewConfig.isFavorite),
    });
  }

  private onSuccess(entity: LiViewConfig): void {
    this.isLoading = false;
    this.update.emit(entity);
  }

  private onError(highlighted: boolean): void {
    this.viewConfig.isFavorite = !highlighted;
    this.isLoading = false;
  }

  get fontSet(): string {
    return this.viewConfig.isFavorite ? 'material-icons' : 'material-icons-outlined';
  }

  get tooltip(): string {
    return this.viewConfig.isFavorite ? 'li.view_favorite_tooltip' : 'li.view_not_favorite_tooltip';
  }
}
