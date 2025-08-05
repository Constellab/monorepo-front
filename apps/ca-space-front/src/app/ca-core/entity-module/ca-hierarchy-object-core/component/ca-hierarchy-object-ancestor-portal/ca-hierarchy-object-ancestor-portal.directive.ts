import { Directive, input } from '@angular/core';
import {
  FlMouseHoverPortalAbstractDirective,
  FlMouseHoverPortalConfig,
} from '@monorepo/front-core-lib/fl-portal';

import { CaHierarchyObjectAncestorPortalComponent } from './ca-hierarchy-object-ancestor-portal.component';

/**
 * Specific directive to open the backup history detail portal
 */
@Directive({ selector: '[caHierarchyObjectAncestorPortal]' })
export class CaHierarchyObjectAncestorPortalDirective extends FlMouseHoverPortalAbstractDirective {
  /**
   * Id of the hierarchy object to display the ancestor
   */
  caHierarchyObjectAncestorPortal = input.required<string>();

  getConfig(): FlMouseHoverPortalConfig | null {
    return {
      data: this.caHierarchyObjectAncestorPortal(),
      position: ['left', 'top', 'bottom', 'right'],
      component: CaHierarchyObjectAncestorPortalComponent,
      portalTagName: 'CA-HIERARCHY-OBJECT-ANCESTOR-PORTAL',
      overlayConfig: {
        disposeOnNavigation: true,
      },
    };
  }

  onPortalClosed(): void {}

  onPortalOpened(): void {}
}
