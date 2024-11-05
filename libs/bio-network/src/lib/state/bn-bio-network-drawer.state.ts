import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import {
  BnBioNetworkDrawerAction,
  BnBioNetworkDrawerStateValue,
} from '../model/bn-bio-network-drawer-action.class';
import { BehaviorSubject, Observable } from 'rxjs';
import { flRxjsEnterNgZone } from '@monorepo/front-core-lib';

/**
 * State to manage the drawer and it's content in the pathway
 */
@Injectable()
export class BnBioNetworkDrawerState implements OnDestroy {
  private drawer: MatDrawer;
  private state$: BehaviorSubject<BnBioNetworkDrawerStateValue>;

  constructor(private ngZone: NgZone) {}

  public init(drawer: MatDrawer): void {
    this.drawer = drawer;
    this.state$ = new BehaviorSubject<BnBioNetworkDrawerStateValue>({
      action: 'config',
      selectedNode: null,
    });
    this.openDrawer();
  }

  public newAction(action: BnBioNetworkDrawerAction): void {
    this.openDrawer();
    this.state$.next(Object.assign(this.state$.value, action));
  }

  public getState$(): Observable<BnBioNetworkDrawerStateValue> {
    return this.state$.asObservable().pipe(flRxjsEnterNgZone(this.ngZone));
  }

  public openDrawer(): void {
    this.ngZone.run(() => {
      this.drawer.open();
    });
  }

  public closeDrawer(): void {
    this.ngZone.run(() => {
      this.drawer.close();
    });
  }

  public drawnOpenChange(): Observable<boolean> {
    return this.drawer.openedChange;
  }

  ngOnDestroy(): void {
    this.state$.complete();
  }
}
