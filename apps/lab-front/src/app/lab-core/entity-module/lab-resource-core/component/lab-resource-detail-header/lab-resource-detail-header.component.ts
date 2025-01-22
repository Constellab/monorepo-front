import { Component, Input, Signal, ViewContainerRef, inject } from '@angular/core';
import { LabResourceDetailState } from '../../state/lab-resource-detail.state';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import { LabRouterService } from '../../../../service/lab-router.service';
import { FlDialogService, FlOverlayRef, FlPortalConfig, FlPortalService } from '@monorepo/front-core-lib';
import {
  LabTransformResourcePortalComponent,
  LabTransformResourcePortalInput,
} from '../../../lab-transformer-core/component/lab-transform-resource-portal/lab-transform-resource-portal.component';
import {
  LabResourceInfoDialogComponent,
  LabResourceInfoDialogInput,
} from '../lab-resource-info-dialog/lab-resource-info-dialog.component';
import { LabResourceAvailableViewsPortalComponent } from '../lab-resource-available-views-portal/lab-resource-available-views-portal.component';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import {
  LabImportResourceDialogComponent,
  LabImportResourceDialogInput,
} from '../lab-import-resource-dialog/lab-import-resource-dialog.component';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { LabFlagButtonComponent } from '../../../lab-entity-core/component/lab-flag-button/lab-flag-button.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { LabResourceActionsMenuComponent } from '../lab-resource-actions-menu/lab-resource-actions-menu.component';
import { MatMenuItem } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialogClose } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { FlColorModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-color/fl-color.module';
import { LabDetailRoutePipe } from '../../../../lab-core-pipe/lab-detail-route/lab-detail-route.pipe';

@Component({
  selector: 'lab-resource-detail-header',
  templateUrl: './lab-resource-detail-header.component.html',
  styleUrls: ['./lab-resource-detail-header.component.scss'],
  imports: [
    FlFormModule,
    RouterLink,
    MatIcon,
    FlIconModule,
    LabFlagButtonComponent,
    MatButton,
    LabResourceActionsMenuComponent,
    MatMenuItem,
    MatIconButton,
    MatTooltip,
    MatDialogClose,
    TranslatePipe,
    FlColorModule,
    LabDetailRoutePipe,
  ],
})
export class LabResourceDetailHeaderComponent {
  private state = inject(LabResourceDetailState);
  private routerService = inject(LabRouterService);
  private portalService = inject(FlPortalService);
  private dialogService = inject(FlDialogService);
  private containerRef = inject(ViewContainerRef);
  private resourceService = inject(LabResourceService);

  @Input() displayMode: 'fullPage' | 'fullDialog' | 'dense' = 'fullPage';

  resource: Signal<LabResource> = this.state.selectedResource;

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
    this.state.createPortal(LabResourceAvailableViewsPortalComponent, config, {}, true);
  }

  openResourceInfoDialog(): void {
    const data: LabResourceInfoDialogInput = {
      resource: this.resource(),
    };
    this.dialogService.openBigDialog(LabResourceInfoDialogComponent, {
      data: data,
      viewContainerRef: this.containerRef,
      panelClass: 'g-dialog-main-background',
      autoFocus: false,
    });
  }

  onUpdate(resource: LabResource): void {
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

    const input: LabTransformResourcePortalInput = {
      resourceName: this.resource().name,
      resourceTypingName: this.resource().resourceTypingName,
      resourceId: this.resource().id,
      currentTransformers: [],
    };

    this.overlay = this.portalService.createPortal(LabTransformResourcePortalComponent, config, input);
    this.overlay.detachments().subscribe(() => (this.overlay = null));
  }

  updateName(name: string): void {
    this.resourceService
      .updateName(this.resource().id, name)
      .subscribe((resource) => this.state.updateResource(resource));
  }

  openImportResource(): void {
    const input: LabImportResourceDialogInput = {
      resourceId: this.resource().id,
      resourceHumanName: this.resource().resourceType.human_name,
      resourceTypingName: this.resource().resourceTypingName,
      nodeExtension: this.resource().fsNode.getExtension(),
    };

    this.dialogService.openMediumDialog(LabImportResourceDialogComponent, { data: input });
  }
}
