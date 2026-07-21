import { ChangeDetectionStrategy,Component, inject, Input, OnDestroy } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ClHelpService } from '@monorepo/core-lib';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlOverlayRef, FlPortalConfig, FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { LiResourceView, LiViewConfigService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Button to open the LiViewConfig preview in a portal
 */
@Component({
  selector: 'li-view-config-preview',
  templateUrl: './li-view-config-preview.component.html',
  styleUrls: ['./li-view-config-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIconButton, MatTooltip, MatIcon, FlLoaderModule, TranslatePipe],
})
export class LiViewConfigPreviewComponent implements OnDestroy {
  private viewConfigService = inject(LiViewConfigService);
  private portalService = inject(FlPortalService);

  @Input() viewConfigId: string;

  isLoading: boolean = false;

  private overlay?: FlOverlayRef;

  showPreview(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.closeOverlay();

    this.isLoading = true;
    // load the view and show it in a portal
    this.viewConfigService.callViewConfig(this.viewConfigId).subscribe({
      next: (view) => this.openPortal(view, event.target as any),
      error: () => (this.isLoading = false),
    });
  }

  private async openPortal(labView: LiResourceView, element: HTMLElement): Promise<void> {
    const portalConfig: FlPortalConfig = this.portalService.configureRelativePortal(
      element,
      ['left', 'bottom', 'right', 'top'],
      {
        disposeOnNavigation: true,
      }
    );

    // Use dynamic import to avoid circular dependency between li-resource and li-view-config
    const type = await import(
      '../../../li-resource/component/li-resource-view-portal/li-resource-view-portal.component'
    );

    this.overlay = this.portalService.createPortal(type.LiResourceViewPortalComponent, portalConfig, {
      labView: labView,
    });

    this.isLoading = false;
  }

  private closeOverlay(): void {
    this.overlay?.dispose();
  }

  ngOnDestroy(): void {
    this.closeOverlay();
  }
}
