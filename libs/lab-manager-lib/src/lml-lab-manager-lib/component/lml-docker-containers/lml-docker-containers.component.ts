import { Component, inject, Input, OnInit } from '@angular/core';
import { FlStatusEvent } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';

import { LmlComposeState } from '../../lml-compose.state';
import { LmlDockerInspect } from '../../model/lml-lab-manager.class';

@Component({
  selector: 'lml-docker-containers',
  templateUrl: './lml-docker-containers.component.html',
  styleUrls: ['./lml-docker-containers.component.scss'],
  standalone: false,
})
export class LmlDockerContainersComponent implements OnInit {
  @Input() readonly: boolean = false;

  composeState = inject(LmlComposeState);

  containers$: Observable<FlStatusEvent<LmlDockerInspect[]>> = new Observable();

  ngOnInit(): void {
    if (this.composeState) {
      this.containers$ = this.composeState.getDockersServices$();
      this.composeState.loadDockerServices();
    }
  }
}
