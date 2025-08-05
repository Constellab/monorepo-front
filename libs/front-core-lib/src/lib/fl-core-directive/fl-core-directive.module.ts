import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlPortalModule } from '../fl-portal/fl-portal.module';
import { FlActiveRouteDirective } from './fl-active-route/fl-active-route.directive';
import { FlAutoScrollToAnchorDirective } from './fl-auto-scroll-to-anchor/fl-auto-scroll-to-anchor.directive';
import { FlAutofocusDirective } from './fl-autofocus/fl-autofocus.directive';
import { FlBackupImageDirective } from './fl-backup-image/fl-backup-image.directive';
import { FlClassDirective } from './fl-class/fl-class.directive';
import {
  FlDisableAnimationInitDirective,
} from './fl-disable-animation-init/fl-disable-animation-init.directive';
import { FlDoubleClickDirective } from './fl-double-click/fl-double-click.directive';
import { FlElasticSearchDirective } from './fl-elastic-search/fl-elastic-search.directive';
import { FlHideDirective } from './fl-hide/fl-hide.directive';
import { FlHideSamePageLinkDirective } from './fl-hide-same-page-link/fl-hide-same-page-link.directive';
import { FlInputMaxLengthDirective } from './fl-input-max-length/fl-input-max-length.directive';
import { FlMouseHoverDirective } from './fl-mouse-hover/fl-mouse-hover.directive';
import { FlOutsideClickDirective } from './fl-outside-click/fl-outside-click.directive';
import { FlRecreateViewDirective } from './fl-recreate-view/fl-recreate-view.directive';

/**
 * Core modules containing directives
 */
@NgModule({
  declarations: [
    FlInputMaxLengthDirective,
    FlMouseHoverDirective,
    FlOutsideClickDirective,
    FlDisableAnimationInitDirective,
    FlAutofocusDirective,
    FlElasticSearchDirective,
    FlAutoScrollToAnchorDirective,
    FlBackupImageDirective,
    FlActiveRouteDirective,
    FlHideDirective,
    FlClassDirective,
    FlHideSamePageLinkDirective,
    FlDoubleClickDirective,
    FlRecreateViewDirective,
  ],
  exports: [
    FlInputMaxLengthDirective,
    FlMouseHoverDirective,
    FlOutsideClickDirective,
    FlDisableAnimationInitDirective,
    FlAutofocusDirective,
    FlElasticSearchDirective,
    FlAutoScrollToAnchorDirective,
    FlBackupImageDirective,
    FlActiveRouteDirective,
    FlHideDirective,
    FlClassDirective,
    FlHideSamePageLinkDirective,
    FlDoubleClickDirective,
    FlRecreateViewDirective,
  ],
  imports: [CommonModule, FlPortalModule],
})
export class FlCoreDirectiveModule {}
