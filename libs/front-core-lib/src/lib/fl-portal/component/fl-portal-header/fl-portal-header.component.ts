import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject,Input, OnInit } from '@angular/core';
import { flCdkOverlayPanelClass } from '@monorepo/front-core-lib/fl-core';

/**
 * Header of the portal with a ng-content for the title. Contain a close button and
 * support drag on header.
 *
 * Can be put in <fl-portal>
 */
@Component({
  selector: 'fl-portal-header',
  templateUrl: './fl-portal-header.component.html',
  styleUrls: ['./fl-portal-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FlPortalHeaderComponent {
  private cdr = inject(ChangeDetectorRef);

  /**
   * When true the portal is movable by drag on header
   */
  @Input() enableDrag: boolean = false;

  dragRootElement = '.' + flCdkOverlayPanelClass;

  // call by another component to disable the drag
  public setEnableDrag(enableDrag: boolean): void {
    this.enableDrag = enableDrag;
    this.cdr.markForCheck();
  }
}
