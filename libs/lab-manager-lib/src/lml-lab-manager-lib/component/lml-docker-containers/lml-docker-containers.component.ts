import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LmlDockerPs } from '../../model/lml-lab-manager.class';
import { LmlLabManagerState } from '../../lml-lab-manager.state';
import { FlStatusEvent } from '@monorepo/front-core-lib';

@Component({
  selector: 'lml-docker-containers',
  templateUrl: './lml-docker-containers.component.html',
  styleUrls: ['./lml-docker-containers.component.scss'],
})
export class LmlDockerContainersComponent implements OnInit {
  private managerState = inject(LmlLabManagerState);

  containers$: Observable<FlStatusEvent<LmlDockerPs[]>> = this.managerState.getDockersContainers$();

  ngOnInit(): void {
    this.managerState.loadDockerContainers();
  }

  refresh(): void {
    this.managerState.refreshDockerContainers();
  }
}
