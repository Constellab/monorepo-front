import { Component, inject, OnInit } from '@angular/core';
import { FlStatusEvent } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';

import { LmlLabManagerState } from '../../lml-lab-manager.state';
import { LmlDockerInspect } from '../../model/lml-lab-manager.class';

@Component({
  selector: 'lml-docker-containers',
  templateUrl: './lml-docker-containers.component.html',
  styleUrls: ['./lml-docker-containers.component.scss'],
  standalone: false,
})
export class LmlDockerContainersComponent implements OnInit {
  private managerState = inject(LmlLabManagerState);

  containers$: Observable<FlStatusEvent<LmlDockerInspect[]>> = this.managerState.getDockersContainers$();

  ngOnInit(): void {
    this.managerState.loadDockerContainers();
  }

  refresh(): void {
    this.managerState.refreshDockerContainers();
  }
}
