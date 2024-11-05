import { Injectable } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';

export interface BnBioNetworkEngineConfig {
  // if true, the network is drawn live, if false it is calculated then draw
  liveDrawing: boolean;
  ignoreNodePositions: boolean;

  alphaMin: number;
  alphaDecay: number;
  velocityDecay: number;
  nodeStrength: number;
  centerStrength: number;
  linkDistance: number;
}

const FL_BIO_NETWORK_DEFAULT_ENGINE_CONFIG: BnBioNetworkEngineConfig = {
  liveDrawing: false,
  ignoreNodePositions: false,

  alphaMin: 0.001,
  alphaDecay: 0.05,
  velocityDecay: 0.4,
  nodeStrength: -30,
  centerStrength: 1,
  linkDistance: 30,
};

@Injectable()
export class BnBioNetworkEngineState {
  private _engineConfig: BnBioNetworkEngineConfig = FL_BIO_NETWORK_DEFAULT_ENGINE_CONFIG;

  get engineConfig(): BnBioNetworkEngineConfig {
    return ClHelpService.deepClone(this._engineConfig);
  }

  set engineConfig(value: BnBioNetworkEngineConfig) {
    this._engineConfig = ClHelpService.deepClone(value);
  }
}
