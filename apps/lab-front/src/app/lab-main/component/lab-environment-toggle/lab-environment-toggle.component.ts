import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { LabDevEnvironmentService } from '../../../lab-core/lab-dev-environment.service';
import { LabEnvStore } from '../../../lab-core/lab-env.store';

@Component({
  selector: 'lab-environment-toggle',
  templateUrl: './lab-environment-toggle.component.html',
  styleUrls: ['./lab-environment-toggle.component.scss'],
  imports: [MatSlideToggle, ReactiveFormsModule, FormsModule, TranslatePipe],
})
export class LabEnvironmentToggleComponent implements OnInit, OnDestroy {
  private labEnvStore = inject(LabEnvStore);
  private labEnvService = inject(LabDevEnvironmentService);

  checked: boolean;

  devApiRunning: boolean = false;

  ready: boolean = false;

  private subscription: Subscription;

  ngOnInit(): void {
    this.checked = this.labEnvStore.isDev();
    this.checkDevApi();
  }

  // disable the toggle if the dev api is not running
  private checkDevApi(): void {
    this.labEnvService.devApiIsRunning().subscribe((isRunning) => {
      this.devApiRunning = isRunning;
      this.ready = true;
    });
  }

  toggleChange(change: MatSlideToggleChange): void {
    if (change.checked) {
      this.labEnvService.activateDevEnvironment().subscribe({
        next: (result) => this.onActivateDevEnvironment(result),
        error: () => (this.checked = false),
      });
    } else {
      this.labEnvStore.setLabEnvironment('prod');
    }
  }

  // if there was a problem with the activation, uncheck the checkbox
  private onActivateDevEnvironment(activate: boolean): void {
    if (!activate) {
      this.checked = false;
    }
  }

  get disabled(): boolean {
    // only disable the toggle if it is not check and the dev api is not running
    return !this.checked && !this.devApiRunning;
  }

  get showHelpMessage(): boolean {
    // show the help message if we checked the api and it is not running
    return !this.checked && !this.devApiRunning;
  }

  // we stop the event propagation on the toggle click to prevent the menu to close
  stopEventPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
