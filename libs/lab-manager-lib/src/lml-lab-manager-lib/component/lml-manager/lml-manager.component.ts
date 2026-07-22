import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { LmlLabManagerState } from '../../lml-lab-manager.state';

/**
 * Component only accessible by the admin
 * LmlLabManagerService must be provided
 */
@Component({
  selector: 'lml-manager',
  templateUrl: './lml-manager.component.html',
  styleUrls: ['./lml-manager.component.scss'],
  standalone: false,
})
export class LmlManagerComponent implements OnInit {
  @Input() autoRefreshStatusFrequency: number;

  private managerState = inject(LmlLabManagerState);
  labManagerIsRunning$: Observable<boolean>;

  ngOnInit(): void {
    this.managerState.init(this.autoRefreshStatusFrequency);

    this.labManagerIsRunning$ = this.managerState.labManagerIsRunning$();
  }
}
