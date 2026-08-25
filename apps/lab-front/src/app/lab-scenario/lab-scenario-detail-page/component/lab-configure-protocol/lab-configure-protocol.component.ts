import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiProcess } from '@monorepo/lab-lib/li-core';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { filter } from 'rxjs/operators';

import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';
import { LabConfigureProcessComponent } from '../lab-configure-process/lab-configure-process.component';

/**
 * Component to configure a protocol, can contains nested protocol
 */
@Component({
  selector: 'lab-configure-protocol',
  templateUrl: './lab-configure-protocol.component.html',
  styleUrls: ['./lab-configure-protocol.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlSectionModule, MatRipple, NgClass, LabConfigureProcessComponent, AsyncPipe],
})
export class LabConfigureProtocolComponent implements OnInit {
  private scenarioState = inject(LabScenarioDetailPageState);

  @Input() protocolId: string;

  selectedProcess$: Observable<LiProcess>;

  private selectedProcessId: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  childrenProcesses$: Observable<LiProcess[]>;

  ngOnInit(): void {
    this.childrenProcesses$ = this.scenarioState.getProtocol$(this.protocolId).pipe(
      switchMap((protocol) => {
        // for each process of the protocol, load the process
        const processes$: Observable<LiProcess>[] = [];
        for (const key in protocol.data.nodes) {
          processes$.push(this.scenarioState.getLabProcess$(protocol.data.nodes[key].id));
        }
        return combineLatest(processes$);
      })
    );

    this.selectedProcess$ = this.selectedProcessId.asObservable().pipe(
      filter((processId): processId is string => processId != null),
      switchMap((processId) => this.scenarioState.getLabProcess$(processId))
    );
  }

  selectProcess(processInstanceName: string): void {
    if (this.selectedProcessId.value === processInstanceName) return;
    this.selectedProcessId.next(processInstanceName);
  }
}
