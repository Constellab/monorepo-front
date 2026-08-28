import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

import { BnBioNetworkEngineConfig, BnBioNetworkEngineState } from '../../state/bn-bio-network-engine.state';

@Component({
  selector: 'bn-bio-network-engine-config',
  templateUrl: './bn-bio-network-engine-config.component.html',
  styleUrls: ['./bn-bio-network-engine-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BnBioNetworkEngineConfigComponent implements OnInit, OnDestroy {
  private engineState = inject(BnBioNetworkEngineState);

  formGp = new FormBuilder().group({
    liveDrawing: [null as boolean | null],
    alphaMin: [null as number | null],
    alphaDecay: [null as number | null],
    velocityDecay: [null as number | null],
    ignoreNodePositions: [null as boolean | null],
    nodeStrength: [null as number | null],
    centerStrength: [null as number | null],
    linkDistance: [null as number | null],
  });

  private subscription: Subscription;

  ngOnInit(): void {
    this.formGp.patchValue(this.engineState.engineConfig);

    // update the engine config when the form changes
    // the patchValue above fills every control, so the emitted value is a complete config
    this.subscription = this.formGp.valueChanges.subscribe(
      (config) => (this.engineState.engineConfig = config as BnBioNetworkEngineConfig)
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
