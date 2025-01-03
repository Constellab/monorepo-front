import {
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  OutputRefSubscription,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
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
  @Input({ required: true }) process$: Observable<LabProcess>;

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  private subscription: Subscription;

  private visibilitySubscription: OutputRefSubscription;

  private dashboardState = inject(LabProcessDashboardState);

  ngOnInit(): void {
    this.subscription = this.process$.subscribe((process) => this.showProcessConfig(process));
  }

  private showProcessConfig(process: LabProcess): void {
    // Check if the config has changed since the last process to avoid reloading the component
    if (!this.dashboardState.configHasChanged(process)) return;
    this.clearViewRef();

    if (process.isProtocol) {
      const componentRef = this.viewContainer.createComponent(LabConfigureProtocolComponent);
      componentRef.instance.protocolId = process.id;
    } else {
      const componentRef = this.viewContainer.createComponent(LabConfigureTaskComponent);
      componentRef.instance.task = process;
    }
  }

  private clearViewRef(): void {
    this.viewContainer?.clear();
  }

  ngOnDestroy(): void {
    this.clearViewRef();
    this.subscription?.unsubscribe();
    this.visibilitySubscription?.unsubscribe();
  }
}
