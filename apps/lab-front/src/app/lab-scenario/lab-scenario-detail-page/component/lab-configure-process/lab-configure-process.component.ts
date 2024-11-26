import { Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LabConfigureProtocolComponent } from '../lab-configure-protocol/lab-configure-protocol.component';
import { LabConfigureTaskComponent } from '../lab-configure-task/lab-configure-task.component';
import { LabProcessDashboardState } from '../../state/lab-process-dashboard.state';
import { LabProcess } from '../../../../lab-core/model/entities/process/lab-process.entity';

/**
 * Component inside LabConfigureProtocol to configure a process.
 * If the process is a task, it calls LabConfigureTask.
 * If the process is a protocol, it calls LabConfigureProtocol (it will be recursive).
 */
@Component({
  selector: 'lab-configure-process',
  templateUrl: './lab-configure-process.component.html',
  styleUrls: ['./lab-configure-process.component.scss'],
})
export class LabConfigureProcessComponent implements OnInit, OnDestroy {
  @Input() process$: Observable<LabProcess>;

  @Input() onCodeShownTrigger: Observable<void>;

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  private subscription: Subscription;

  constructor(private nodeState: LabProcessDashboardState) {}

  ngOnInit(): void {
    this.subscription = this.process$.subscribe((process) => {
      this.showProcessConfig(process);
    });
  }

  private showProcessConfig(process: LabProcess): void {
    // Check if the config has changed since the last process to avoid reloading the component
    if (!this.nodeState.configHasChanged(process)) return;
    this.clearViewRef();

    if (process.isProtocol) {
      const componentRef = this.viewContainer.createComponent(LabConfigureProtocolComponent);
      componentRef.instance.protocolId = process.id;
    } else {
      const componentRef = this.viewContainer.createComponent(LabConfigureTaskComponent);
      componentRef.instance.task = process;
      componentRef.instance.onCodeShownTrigger = this.onCodeShownTrigger;
    }
  }

  private clearViewRef(): void {
    this.viewContainer?.clear();
  }

  ngOnDestroy(): void {
    this.clearViewRef();
    this.subscription?.unsubscribe();
  }
}
