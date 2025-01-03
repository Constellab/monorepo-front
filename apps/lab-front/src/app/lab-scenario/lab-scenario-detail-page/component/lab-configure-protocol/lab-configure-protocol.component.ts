import { Component, Input, OnInit } from '@angular/core';
import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LabProcess } from '../../../../lab-core/model/entities/process/lab-process.entity';

/**
 * Component to configure a protocol, can contains nested protocol
 */
@Component({
  selector: 'lab-configure-protocol',
  templateUrl: './lab-configure-protocol.component.html',
  styleUrls: ['./lab-configure-protocol.component.scss'],
})
export class LabConfigureProtocolComponent implements OnInit {
  @Input() protocolId: string;

  selectedProcess$: Observable<LabProcess>;

  private selectedProcessId: BehaviorSubject<string> = new BehaviorSubject(null);

  processes$: Observable<LabProcess[]>;

  constructor(private scenarioState: LabScenarioDetailPageState) {}

  ngOnInit(): void {
    this.processes$ = this.scenarioState
      .getProtocol$(this.protocolId)
      .pipe(map((protocol) => Object.values(protocol.data.nodes)));

    this.selectedProcess$ = this.selectedProcessId.asObservable().pipe(
      filter((processName) => processName != null),
      switchMap((processName) => this.scenarioState.getLabProcess$(this.protocolId, processName))
    );
  }

  selectProcess(processInstanceName: string): void {
    if (this.selectedProcessId.value === processInstanceName) return;
    this.selectedProcessId.next(processInstanceName);
  }
}
