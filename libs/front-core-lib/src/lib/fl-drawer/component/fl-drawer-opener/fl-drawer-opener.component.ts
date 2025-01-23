import { ChangeDetectorRef, Component, HostListener, Input, NgZone, inject } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

/**
 * Component to be placed under a mat-sidenav or mat-drawer. It will open the drawer on mouse hover.
 */
@Component({
  selector: 'fl-drawer-opener',
  templateUrl: './fl-drawer-opener.component.html',
  styleUrls: ['./fl-drawer-opener.component.scss'],
  standalone: false,
})
export class FlDrawerOpenerComponent {
  private ngZone = inject(NgZone);
  private changeDetectorRef = inject(ChangeDetectorRef);

  @Input() drawer: MatDrawer;

  /**
   * Delay in ms before the drawer is opened on mouse hover. Default is 100ms.
   * If the mouse leaves the component before the delay, the drawer will not be opened.
   */
  @Input() hoverDelay: number = 200;

  private timeout: any;

  @HostListener('mouseenter', ['$event']) onMouseEnter(mouse: MouseEvent): void {
    // don't open the drawer if a button of the mouse is pressed (this can mean that the user drag an object)
    if (mouse.buttons !== 0) return;

    this.timeout = setTimeout(() => this.openDrawer(), this.hoverDelay);
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(): void {
    clearTimeout(this.timeout);
  }

  @HostListener('click') onMouseClick(): void {
    this.openDrawer();
  }

  private openDrawer(): void {
    this.drawer.open();
    this.changeDetectorRef.markForCheck();
  }
}
