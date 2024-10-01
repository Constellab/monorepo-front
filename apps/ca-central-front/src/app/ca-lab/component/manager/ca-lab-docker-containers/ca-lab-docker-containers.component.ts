import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CaLabDockerPs } from '../../../../ca-core/model/entities/lab/ca-lab-manager.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';

@Component({
  selector: 'ca-lab-docker-containers',
  templateUrl: './ca-lab-docker-containers.component.html',
  styleUrls: ['./ca-lab-docker-containers.component.scss']
})
export class CaLabDockerContainersComponent implements OnInit {

  // don't load containers on init, wait for the user to click on refresh
  containers$: Observable<CaLabDockerPs[]> = of([]);

  labId: string = this.state.getLabId();

  constructor(private labService: CaLabService,
              private state: CaLabDetailPageState) {
  }

  ngOnInit(): void {
  }

  refresh(): void {
    this.containers$ = this.labService.listContainers(this.state.getLabId());
  }
}
