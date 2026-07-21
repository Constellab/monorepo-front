import { AfterViewInit, ChangeDetectionStrategy,Component, inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { FlEventWrapper } from '@monorepo/front-core-lib/fl-core';
import { FL_PORTAL_DATA, FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';

import { FlMenuDynamic, FlMenuDynamicInput } from '../../model/fl-menu-dynamic.class';
import { FlMenuDynamicComponent } from '../fl-menu-dynamic/fl-menu-dynamic.component';

/**
 * this is a simple portal to wrap the menu-dynamic
 */
@Component({
  selector: 'fl-menu-dynamic-portal',
  templateUrl: './fl-menu-dynamic-portal.component.html',
  styleUrls: ['./fl-menu-dynamic-portal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlMenuDynamicPortalComponent implements OnInit, AfterViewInit, OnDestroy {
  private overlayRef = inject(FlOverlayRef);
  private renderer = inject(Renderer2);

  @ViewChild(MatMenuTrigger, { static: true }) menuTrigger: MatMenuTrigger;

  menu: FlMenuDynamicInput = inject(FL_PORTAL_DATA);

  private listener: () => void;

  ngOnInit(): void {
    // when the menu closed, dispose the overlay
    this.menuTrigger.menuClosed.subscribe(() => this.overlayRef.dispose());
  }

  // open the menu on start
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.menuTrigger.openMenu();

      this.listener = this.renderer.listen('body', 'mousedown', (event) => this.onBodyClick(event));
    }, 0);
  }

  // use to close the menu if the click is outside the menu
  private onBodyClick(event: MouseEvent): void {
    const eventWrapper = new FlEventWrapper(event);

    // if the mouse event is in the mat menu, do nothing
    if (eventWrapper.parentHasClass(FlMenuDynamicComponent.containerClass)) {
      return;
    }

    // otherwise, close the menu (this means that the click is outside the menu)
    this.menuTrigger.closeMenu();
  }

  onButtonClick(menuItem: FlMenuDynamic): void {
    this.overlayRef.dispose(menuItem);
  }

  ngOnDestroy(): void {
    if (this.listener) {
      this.listener();
    }
  }
}
