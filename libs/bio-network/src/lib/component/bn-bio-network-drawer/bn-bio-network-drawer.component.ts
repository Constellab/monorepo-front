import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { flCdkOverlayContainerClass } from '@monorepo/front-core-lib/fl-core';
import { Subscription } from 'rxjs';

import { BnBioNetworkDrawerActionName } from '../../model/bn-bio-network-drawer-action.class';
import { BnBioNetworkDrawerState } from '../../state/bn-bio-network-drawer.state';

@Component({
  selector: 'bn-bio-network-drawer',
  templateUrl: './bn-bio-network-drawer.component.html',
  styleUrls: ['./bn-bio-network-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class BnBioNetworkDrawerComponent implements OnInit, OnDestroy {
  private drawerState = inject(BnBioNetworkDrawerState);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatTabGroup, { static: true }) tab: MatTabGroup;

  tabIndex: number;

  pinnedDrawer: boolean = false;

  // use to ignore the mouse event on the CDK to keep the drawer open if an overlay is opened
  cdkContainerClass: string = flCdkOverlayContainerClass;

  private subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.drawerState.getState$().subscribe((state) => this.changeTab(state.action));
  }

  private changeTab(action: BnBioNetworkDrawerActionName): void {
    // TODO this trigger a mark for check error when is triggered by the search
    switch (action) {
      case 'config':
        this.tabIndex = 0;
        break;
      case 'nodeDetail':
        this.tabIndex = 1;
        break;
    }
    this.cdr.markForCheck();
  }

  closeDrawer(): void {
    this.drawerState.closeDrawer();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
