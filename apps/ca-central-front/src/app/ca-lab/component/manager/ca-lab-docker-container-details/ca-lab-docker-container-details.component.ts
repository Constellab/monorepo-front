import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CaLabDockerContainerSize,
  CaLabDockerPsFull,
} from '../../../../ca-core/model/entities/lab/ca-lab-manager.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';

/**
 * Component to show the details of a container
 */
@Component({
  selector: 'ca-lab-docker-container-details',
  templateUrl: './ca-lab-docker-container-details.component.html',
  styleUrls: ['./ca-lab-docker-container-details.component.scss'],
})
export class CaLabDockerContainerDetailsComponent implements OnInit {
  @Input() labId: string;
  @Input() containerName: string;

  container$: Observable<CaLabDockerPsFull>;
  size$: Observable<CaLabDockerContainerSize>;

  constructor(private labService: CaLabService) {}

  ngOnInit(): void {
    this.container$ = this.labService.getContainerDetails(this.labId, this.containerName);
  }

  getSize(): void {
    this.size$ = this.labService.getContainerSize(this.labId, this.containerName);
  }
}
