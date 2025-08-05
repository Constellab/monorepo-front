import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

import { BnBioNetwork } from '../../model/bn-bio-network.class';
import { BnBioNetworkMainRenderer } from '../../renderer/bn-bio-network-main.renderer';
import { BnBioNetworkZoomRenderer } from '../../renderer/bn-bio-network-zoom.renderer';
import { BnBioNetworkState } from '../../state/bn-bio-network.state';
import { BnBioNetworkDrawerState } from '../../state/bn-bio-network-drawer.state';
import { BnBioNetworkEngineState } from '../../state/bn-bio-network-engine.state';
import { BnBioNetworkGridState } from '../../state/bn-bio-network-grid.state';
import { BnBioNetworkOptionsState } from '../../state/bn-bio-network-options.state';
import { BnBioNetworkSelectionState } from '../../state/bn-bio-network-selection.state';
import { BnBioNetworkSimulationState } from '../../state/bn-bio-network-simulation.state';

@Component({
  selector: 'bn-bio-network',
  templateUrl: './bn-bio-network.component.html',
  styleUrls: ['./bn-bio-network.component.scss'],
  providers: [
    BnBioNetworkState,
    BnBioNetworkDrawerState,
    BnBioNetworkOptionsState,
    BnBioNetworkSelectionState,
    BnBioNetworkMainRenderer,
    BnBioNetworkGridState,
    BnBioNetworkZoomRenderer,
    BnBioNetworkEngineState,
    BnBioNetworkSimulationState,
  ],
  standalone: false,
})
export class BnBioNetworkComponent implements OnInit {
  private state = inject(BnBioNetworkState);
  private drawerState = inject(BnBioNetworkDrawerState);
  private rendererState = inject(BnBioNetworkMainRenderer);
  private zoomRenderer = inject(BnBioNetworkZoomRenderer);

  @Input() networks: BnBioNetwork;

  @ViewChild('networkContainer', { static: true }) networkContainer: ElementRef;

  @ViewChild(MatDrawer, { static: true }) drawer: MatDrawer;

  ngOnInit(): void {
    this.state.init(this.networks);
    // init the drawer state
    this.drawerState.init(this.drawer);

    this.rendererState.init(this.networkContainer.nativeElement);
    this.zoomRenderer.init();
  }

  openDrawer(): void {
    this.drawerState.openDrawer();
  }

  closeDrawer(): void {
    this.drawerState.closeDrawer();
  }
}
