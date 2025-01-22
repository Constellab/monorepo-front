import { Component, OnInit, inject } from '@angular/core';
import {
  BnBioNetworkSimulationProgressEvent,
  BnBioNetworkSimulationState,
} from '../../state/bn-bio-network-simulation.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'bn-bio-network-engine-progress',
  templateUrl: './bn-bio-network-engine-progress.component.html',
  styleUrls: ['./bn-bio-network-engine-progress.component.scss'],
  standalone: false,
})
export class BnBioNetworkEngineProgressComponent implements OnInit {
  private simulationState = inject(BnBioNetworkSimulationState);

  progress$: Observable<BnBioNetworkSimulationProgressEvent>;

  ngOnInit(): void {
    this.progress$ = this.simulationState.getProgress$();
  }
}
