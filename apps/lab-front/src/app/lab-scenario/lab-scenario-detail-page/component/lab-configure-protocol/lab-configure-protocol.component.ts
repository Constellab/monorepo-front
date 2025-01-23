import { Component, inject, Input, OnInit } from '@angular/core';
import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { LabProcess } from '../../../../lab-core/model/entities/process/lab-process.entity';
import { filter } from 'rxjs/operators';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { MatRipple } from '@angular/material/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { LabConfigureProcessComponent } from '../lab-configure-process/lab-configure-process.component';

/**
 * Component to configure a protocol, can contains nested protocol
 */
@Component({
  selector: 'lab-configure-protocol',
  templateUrl: './lab-configure-protocol.component.html',
  styleUrls: ['./lab-configure-protocol.component.scss'],
  imports: [FlSectionModule, MatRipple, NgClass, LabConfigureProcessComponent, AsyncPipe],
})
export class LabConfigureProtocolComponent implements OnInit {
  private scenarioState = inject(LabScenarioDetailPageState);

  @Input() protocolId: string;

  selectedProcess$: Observable<LabProcess>;

  private selectedProcessId: BehaviorSubject<string> = new BehaviorSubject(null);

  childrenProcesses$: Observable<LabProcess[]>;

  ngOnInit(): void {
    this.childrenProcesses$ = this.scenarioState.getProtocol$(this.protocolId).pipe(
      switchMap((protocol) => {
        // for each process of the protocol, load the process
        const processes$: Observable<LabProcess>[] = [];
        for (const key in protocol.data.nodes) {
          processes$.push(this.scenarioState.getLabProcess$(protocol.data.nodes[key].id));
        }
        return combineLatest(processes$);
      })
    );

    this.selectedProcess$ = this.selectedProcessId.asObservable().pipe(
      filter((processId) => processId != null),
      switchMap((processId) => this.scenarioState.getLabProcess$(processId))
    );
  }

  selectProcess(processInstanceName: string): void {
    if (this.selectedProcessId.value === processInstanceName) return;
    this.selectedProcessId.next(processInstanceName);
  }
}
