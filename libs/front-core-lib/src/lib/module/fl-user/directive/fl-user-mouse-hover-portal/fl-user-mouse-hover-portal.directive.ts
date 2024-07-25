import {Directive, Input} from '@angular/core';
import {
  FlMouseHoverPortalAbstractDirective
} from '../../../../abstract-directive/mouse-hover/fl-mouse-hover-portal-abstract.directive';
import {FlMouseHoverPortalConfig} from '../../../../abstract-directive/mouse-hover/fl-mouse-hover-portal.config';
import {FlUserInfoPortalComponent} from '../../component/fl-user-info-portal/fl-user-info-portal.component';
import {FlUser} from '../../model/fl-user.class';

@Directive({
  selector: '[flUserMouseHoverPortal]'
})
export class FlUserMouseHoverPortalDirective extends FlMouseHoverPortalAbstractDirective {

  @Input() flUserMouseHoverPortal: FlUser;

  getConfig(): FlMouseHoverPortalConfig | null {
    return {
      data: this.flUserMouseHoverPortal,
      position: ['right', 'bottom', 'left', 'top'],
      component: FlUserInfoPortalComponent,
      portalTagName: 'FL-USER-INFO-PORTAL',
      overlayConfig: {
        disposeOnNavigation: true
      }
    };
  }

  onPortalClosed(): void {
  }

  onPortalOpened(): void {
  }

}
