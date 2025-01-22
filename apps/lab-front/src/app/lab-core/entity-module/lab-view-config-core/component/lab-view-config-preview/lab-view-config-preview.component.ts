import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';
import { LabResourceView } from '../../../../model/entities/resource/lab-resource-view.entity';
import { FlOverlayRef, FlPortalConfig, FlPortalService } from '@monorepo/front-core-lib';
import {
  LabResourceViewPortalComponent,
  LabResourceViewPortalInput,
} from '../../../lab-resource-core/component/lab-resource-view-portal/lab-resource-view-portal.component';
import { LabViewConfigService } from '../../../../entity-service/lab-view-config.service';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Button to open the LabViewConfig preview in a portal
 */
@Component({
  selector: 'lab-view-config-preview',
  templateUrl: './lab-view-config-preview.component.html',
  styleUrls: ['./lab-view-config-preview.component.scss'],
  imports: [MatIconButton, MatTooltip, MatIcon, FlLoaderModule, TranslatePipe],
})
export class LabViewConfigPreviewComponent implements OnInit, OnDestroy {
  private viewConfigService = inject(LabViewConfigService);
  private portalService = inject(FlPortalService);

  @Input() viewConfigId: string;

  isLoading: boolean = false;

  private overlay?: FlOverlayRef;

  ngOnInit(): void {}

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

  private openPortal(labView: LabResourceView, element: HTMLElement): void {
    const portalConfig: FlPortalConfig = this.portalService.configureRelativePortal(
      element,
      ['left', 'bottom', 'right', 'top'],
      {
        disposeOnNavigation: true,
      }
    );

    const config: LabResourceViewPortalInput = {
      labView: labView,
    };

    this.overlay = this.portalService.createPortal(LabResourceViewPortalComponent, portalConfig, config);

    this.isLoading = false;
  }

  private closeOverlay(): void {
    this.overlay?.dispose();
  }

  ngOnDestroy(): void {
    this.closeOverlay();
  }
}
