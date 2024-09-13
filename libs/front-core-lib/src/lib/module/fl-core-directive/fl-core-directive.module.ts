import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlInputMaxLengthDirective} from './fl-input-max-length/fl-input-max-length.directive';
import {FlPortalModule} from '../fl-portal/fl-portal.module';
import {FlForByIdOfDirective} from './fl-for-by-id-of/fl-for-by-id-of.directive';
import {FlMouseHoverDirective} from './fl-mouse-hover/fl-mouse-hover.directive';
import {FlOutsideClickDirective} from './fl-outside-click/fl-outside-click.directive';
import {FlDisableAnimationInitDirective} from './fl-disable-animation-init/fl-disable-animation-init.directive';
import {FlAutofocusDirective} from './fl-autofocus/fl-autofocus.directive';
import {FlElasticSearchDirective} from './fl-elastic-search/fl-elastic-search.directive';
import {FlAutoScrollToAnchorDirective} from './fl-auto-scroll-to-anchor/fl-auto-scroll-to-anchor.directive';
import {FlBackupImageDirective} from './fl-backup-image/fl-backup-image.directive';
import {FlActiveRouteDirective} from './fl-active-route/fl-active-route.directive';
import {FlHideDirective} from './fl-hide/fl-hide.directive';
import {FlClassDirective} from './fl-class/fl-class.directive';
import {FlHideSamePageLinkDirective} from './fl-hide-same-page-link/fl-hide-same-page-link.directive';
import { FlDoubleClickDirective } from './fl-double-click/fl-double-click.directive';

/**
 * Core modules containing directives
 */
@NgModule({
  declarations: [
    FlInputMaxLengthDirective,
    FlForByIdOfDirective,
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
  ],
  exports: [
    FlInputMaxLengthDirective,
    FlForByIdOfDirective,
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
  ],
  imports: [CommonModule, FlPortalModule],
})
export class FlCoreDirectiveModule {}
