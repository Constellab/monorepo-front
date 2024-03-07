import {Directive, Input} from '@angular/core';
import {FlMouseHoverPortalAbstractDirective, FlMouseHoverPortalConfig} from '@monorepo/front-core-lib';
import {HaIcon} from '../../ha-core/ha-model/ha-entities/ha-icon.class';
import {HaIconInfoPortalComponent} from '../component/ha-icon-info-portal/ha-icon-info-portal.component';

@Directive({
  selector: '[haIconMouseHoverPortal]'
})
export class HaIconMouseHoverPortalDirective extends FlMouseHoverPortalAbstractDirective {

  @Input() haIconMouseHoverPortal: HaIcon;

  getConfig(): FlMouseHoverPortalConfig | null {
    return {
      data: this.haIconMouseHoverPortal,
      position: ['right', 'bottom', 'left', 'top'],
      component: HaIconInfoPortalComponent,
      portalTagName: 'HA-ICON-INFO-PORTAL',
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
