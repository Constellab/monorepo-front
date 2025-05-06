import { Component, computed, inject, input } from '@angular/core';
import { CaHierarchyObject } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { ClHelpService } from '@monorepo/core-lib';
import { CaHierarchyObjectActionsMenuState } from '../../state/ca-hierarchy-object-actions-menu.state';

@Component({
  selector: 'ca-hierarchy-object-actions-menu',
  imports: [MatIcon, MatIconButton],
  templateUrl: './ca-hierarchy-object-actions-menu.component.html',
  styleUrl: './ca-hierarchy-object-actions-menu.component.scss',
})
export class CaHierarchyObjectActionsMenuComponent {
  hierarchyObject = input.required<CaHierarchyObject>();

  private actionsMenuState = inject(CaHierarchyObjectActionsMenuState);

  showMenuButton = computed(() => this.actionsMenuState.hierarchyObjectHasActionMenu(this.hierarchyObject()));

  hierarchyObjectMenuClick(hierarchyObject: CaHierarchyObject, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.actionsMenuState.openHierarchyObjectActionMenu(hierarchyObject, event);
  }
}
