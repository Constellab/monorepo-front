import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {BnBioNetworkEngineConfig, BnBioNetworkEngineState} from '../../state/bn-bio-network-engine.state';

@Component({
  selector: 'bn-bio-network-engine-config',
  templateUrl: './bn-bio-network-engine-config.component.html',
  styleUrls: ['./bn-bio-network-engine-config.component.scss']
})
export class BnBioNetworkEngineConfigComponent implements OnInit, OnDestroy {

  formGp: FormGroup<BnBioNetworkEngineConfig>;

  private subscription: Subscription;

  constructor(private engineState: BnBioNetworkEngineState) {
  }

  ngOnInit(): void {
    this.formGp = new FormBuilder().group<BnBioNetworkEngineConfig>({
      liveDrawing: [null],
      alphaMin: [null],
      alphaDecay: [null],
      velocityDecay: [null],
      ignoreNodePositions: [null],
      nodeStrength: [null],
      centerStrength: [null],
      linkDistance: [null],
    });

    this.formGp.patchValue(this.engineState.engineConfig);

    // update the engine config when the form changes
    this.subscription = this.formGp.valueChanges.subscribe(
      (config: BnBioNetworkEngineConfig) => this.engineState.engineConfig = config
    );
  }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}
