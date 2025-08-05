import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BnBioNetworkReaction, BnBioNetworkReactionDataFlux } from '../../model/bn-bio-network.class';
import { BnBioNetworkHelper } from '../../utils/bn-bio-network.helper';

/**
 * Show the information about a reaction flux
 */
@Component({
  selector: 'bn-bio-network-reaction-flux',
  templateUrl: './bn-bio-network-reaction-flux.component.html',
  styleUrls: ['./bn-bio-network-reaction-flux.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class BnBioNetworkReactionFluxComponent {
  @Input() reaction: BnBioNetworkReaction;

  get getFlux(): BnBioNetworkReactionDataFlux {
    return BnBioNetworkHelper.getReactionFlux(this.reaction.data);
  }

  get hasConstraints(): boolean {
    return this.reaction.lower_bound != null && this.reaction.upper_bound != null;
  }

  get fluxConstraintsTooltip(): string {
    if (this.hasConstraints) {
      return `[${this.reaction.lower_bound},${this.reaction.upper_bound}]`;
    }
    return null;
  }

  fluxEstimateInterval(flux: BnBioNetworkReactionDataFlux): string {
    if (flux.upper_bound != null && flux.lower_bound != null) {
      return `[${flux.lower_bound},${flux.upper_bound}]`;
    }
    return null;
  }
}
