import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

import { BnBioNetworkEngineConfig, BnBioNetworkEngineState } from '../../state/bn-bio-network-engine.state';

@Component({
  selector: 'bn-bio-network-engine-config',
  templateUrl: './bn-bio-network-engine-config.component.html',
  styleUrls: ['./bn-bio-network-engine-config.component.scss'],
  standalone: false,
})
export class BnBioNetworkEngineConfigComponent implements OnInit, OnDestroy {
  private engineState = inject(BnBioNetworkEngineState);

  formGp = new FormBuilder().group({
    liveDrawing: [null],
    alphaMin: [null],
    alphaDecay: [null],
    velocityDecay: [null],
    ignoreNodePositions: [null],
    nodeStrength: [null],
    centerStrength: [null],
    linkDistance: [null],
  });

  private subscription: Subscription;

  ngOnInit(): void {
    this.formGp.patchValue(this.engineState.engineConfig);

    // update the engine config when the form changes
    this.subscription = this.formGp.valueChanges.subscribe(
      (config: BnBioNetworkEngineConfig) => (this.engineState.engineConfig = config)
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
