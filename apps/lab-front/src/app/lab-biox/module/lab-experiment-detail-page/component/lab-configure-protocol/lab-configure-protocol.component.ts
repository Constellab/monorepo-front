import {Component, Input, OnInit} from '@angular/core';
import {LabExperimentDetailPageState} from '../../state/lab-experiment-detail-page.state';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import {LabProcess} from '../../../../../lab-core/model/entities/process/lab-process.entity';
import {filter, map} from 'rxjs/operators';

/**
 * Component to configure a protocol, can contains nested protocol
 */
@Component({
  selector: 'lab-configure-protocol',
  templateUrl: './lab-configure-protocol.component.html',
  styleUrls: ['./lab-configure-protocol.component.scss']
})
export class LabConfigureProtocolComponent implements OnInit {

  @Input() protocolId: string;

  selectedProcess$: Observable<LabProcess>;

  private selectedProcessId: BehaviorSubject<string> = new BehaviorSubject(null);

  processes$: Observable<LabProcess[]>;

  constructor(private experimentState: LabExperimentDetailPageState) {
  }

  ngOnInit(): void {
    this.processes$ = this.experimentState.getOrLoadLayer$(this.protocolId).pipe(
      map(layer => layer.getProcessNodes().map(node => node.currentObject) as LabProcess[])
    );

    this.selectedProcess$ = this.selectedProcessId.asObservable().pipe(
      filter(processName => processName != null),
      switchMap(processName => this.processes$.pipe()
        .pipe(
          map(processes => processes.find(process => process.instanceName === processName))
        )
      )
    );
  }


  selectProcess(process: LabProcess): void {
    if (this.selectedProcessId.value === process.instanceName) return;
    this.selectedProcessId.next(process.instanceName);
  }
}
