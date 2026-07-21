import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import {
  BnBioNetworkSimulationProgressEvent,
  BnBioNetworkSimulationState,
} from '../../state/bn-bio-network-simulation.state';

@Component({
  selector: 'bn-bio-network-engine-progress',
  templateUrl: './bn-bio-network-engine-progress.component.html',
  styleUrls: ['./bn-bio-network-engine-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BnBioNetworkEngineProgressComponent implements OnInit {
  private simulationState = inject(BnBioNetworkSimulationState);

  progress$: Observable<BnBioNetworkSimulationProgressEvent>;

  ngOnInit(): void {
    this.progress$ = this.simulationState.getProgress$();
  }
}
