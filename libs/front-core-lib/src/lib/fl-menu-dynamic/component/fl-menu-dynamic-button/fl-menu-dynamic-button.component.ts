import { Component, computed, EventEmitter, input, Output, Signal } from '@angular/core';
import {
  FlMenuDynamic,
  FlMenuDynamicButton,
  FlMenuDynamicDownloadLink,
  FlMenuDynamicLink,
} from '../../model/fl-menu-dynamic.class';
import { FlThemeHelper } from '@monorepo/front-core-lib/fl-theme';

/**
 * Leaf button of the DynamicMenu, doesn't work for parent buttons
 */
@Component({
  selector: 'fl-menu-dynamic-button',
  templateUrl: './fl-menu-dynamic-button.component.html',
  styleUrls: ['./fl-menu-dynamic-button.component.scss'],
  standalone: false,
})
export class FlMenuDynamicButtonComponent {
  menuDynamic = input.required<FlMenuDynamic>();

  link: Signal<FlMenuDynamicLink> = computed(() => this.menuDynamic() as FlMenuDynamicLink);
  downloadLink: Signal<FlMenuDynamicDownloadLink> = computed(
    () => this.menuDynamic() as FlMenuDynamicDownloadLink
  );
  button: Signal<FlMenuDynamicButton> = computed(() => this.menuDynamic() as FlMenuDynamicButton);

  textColor: Signal<string | null> = computed(() => FlThemeHelper.paletteToTextCssClass(this.button().color));

  @Output() buttonClick: EventEmitter<FlMenuDynamic> = new EventEmitter();

  callItem(menuItem: FlMenuDynamicButton, event: MouseEvent): void {
    if (menuItem.onClick) {
      menuItem.onClick(event);
    }
    this.buttonClick.next(menuItem);
  }
}
