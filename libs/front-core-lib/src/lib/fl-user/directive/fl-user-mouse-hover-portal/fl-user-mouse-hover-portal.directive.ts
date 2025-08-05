import { Directive, Input } from '@angular/core';
import {
  FlMouseHoverPortalAbstractDirective,
  FlMouseHoverPortalConfig,
} from '@monorepo/front-core-lib/fl-portal';

import { FlUserInfoPortalComponent } from '../../component/fl-user-info-portal/fl-user-info-portal.component';
import { FlUser } from '../../model/fl-user.class';

@Directive({
  selector: '[flUserMouseHoverPortal]',
  standalone: false,
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
        disposeOnNavigation: true,
      },
    };
  }

  onPortalClosed(): void {}

  onPortalOpened(): void {}
}
