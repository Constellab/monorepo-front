import { Component, inject, Input, Signal, ViewContainerRef } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenuItem } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FlColorModule } from '@monorepo/front-core-lib/fl-color';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlOverlayRef, FlPortalConfig, FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LiDetailRoutePipe, LiResource, LiResourceService, LiRouterService } from '@monorepo/lab-lib/li-core';
import { LiFlagButtonComponent } from '@monorepo/lab-lib/li-entity';
import { LiFolderInlineComponent } from '@monorepo/lab-lib/li-folder';
import {
  LiTransformResourcePortalComponent,
  LiTransformResourcePortalInput,
} from '@monorepo/lab-lib/li-transformer';
import { TranslatePipe } from '@ngx-translate/core';

import { LiResourceDetailState } from '../../state/li-resource-detail.state';
import {
  LiImportResourceDialogComponent,
  LiImportResourceDialogInput,
} from '../li-import-resource-dialog/li-import-resource-dialog.component';
import { LiResourceActionsMenuComponent } from '../li-resource-actions-menu/li-resource-actions-menu.component';
import { LiResourceAvailableViewsPortalComponent } from '../li-resource-available-views-portal/li-resource-available-views-portal.component';
import {
  LiResourceInfoDialogComponent,
  LiResourceInfoDialogInput,
} from '../li-resource-info-dialog/li-resource-info-dialog.component';

@Component({
  selector: 'li-resource-detail-header',
  templateUrl: './li-resource-detail-header.component.html',
  styleUrls: ['./li-resource-detail-header.component.scss'],
  imports: [
    FlFormModule,
    RouterLink,
    MatIcon,
    FlIconModule,
    LiFlagButtonComponent,
    MatButton,
    LiResourceActionsMenuComponent,
    MatMenuItem,
    MatIconButton,
    MatTooltip,
    MatDialogClose,
    TranslatePipe,
    FlColorModule,
    LiDetailRoutePipe,
    LiFolderInlineComponent,
  ],
})
export class LiResourceDetailHeaderComponent {
  private state = inject(LiResourceDetailState);
  private routerService = inject(LiRouterService);
  private portalService = inject(FlPortalService);
  private dialogService = inject(FlDialogService);
  private containerRef = inject(ViewContainerRef);
  private resourceService = inject(LiResourceService);

  @Input() displayMode: 'fullPage' | 'fullDialog' | 'dense' = 'fullPage';

  resource: Signal<LiResource> = this.state.selectedResource;

  private overlay: FlOverlayRef;

  openViewSpecListPortal(event: MouseEvent): void {
    const config = this.portalService.configureRelativePortalFromMouseEvent(
      event,
      ['bottom', 'right', 'left'],
      {
        hasBackdrop: true,
        disposeOnNavigation: true,
        disposeOnBackdropClick: true,
        transparentBackdrop: true,
      }
    );
    this.state.createPortal(LiResourceAvailableViewsPortalComponent, config, {}, true);
  }

  openResourceInfoDialog(): void {
    const data: LiResourceInfoDialogInput = {
      resource: this.resource(),
    };
    this.dialogService.openBigDialog(LiResourceInfoDialogComponent, {
      data: data,
      viewContainerRef: this.containerRef,
      panelClass: 'g-dialog-main-background',
      autoFocus: false,
    });
  }

  onUpdate(resource: LiResource): void {
    this.state.updateResource(resource);
  }

  onDelete(): void {
    this.routerService.navigateToDatabox();
  }

  async openTransformerResource(): Promise<void> {
    if (this.overlay) return;

    const config: FlPortalConfig = this.portalService.configureAbsolutePortal(
      { centerHorizontally: '0', top: '0' },
      {
        disposeOnNavigation: true,
        hasBackdrop: true,
        transparentBackdrop: true,
      }
    );

    const input: LiTransformResourcePortalInput = {
      resourceName: this.resource().name,
      resourceTypingName: this.resource().resourceTypingName,
      resourceId: this.resource().id,
      currentTransformers: [],
    };

    this.overlay = this.portalService.createPortal(LiTransformResourcePortalComponent, config, input);
    this.overlay.detachments().subscribe(() => (this.overlay = null));
  }

  updateName(name: string): void {
    this.resourceService
      .updateName(this.resource().id, name)
      .subscribe((resource) => this.state.updateResource(resource));
  }

  openImportResource(): void {
    const input: LiImportResourceDialogInput = {
      resourceId: this.resource().id,
      resourceHumanName: this.resource().resourceType.human_name,
      resourceTypingName: this.resource().resourceTypingName,
      nodeExtension: this.resource().fsNode.getExtension(),
    };

    this.dialogService.openMediumDialog(LiImportResourceDialogComponent, { data: input });
  }
}
