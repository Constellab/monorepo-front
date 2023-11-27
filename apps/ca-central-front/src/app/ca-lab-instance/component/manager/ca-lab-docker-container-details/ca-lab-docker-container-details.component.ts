import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CaLabDockerPsFull} from '../../../../ca-core/model/entities/lab/ca-lab-manager.class';
import {CaLabInstanceService} from '../../../../ca-core/service-api/ca-lab-instance.service';

/**
 * Component to show the details of a container
 */
@Component({
  selector: 'ca-lab-docker-container-details',
  templateUrl: './ca-lab-docker-container-details.component.html',
  styleUrls: ['./ca-lab-docker-container-details.component.scss'],
})
export class CaLabDockerContainerDetailsComponent implements OnInit{

  @Input() labInstanceId: string;
  @Input() containerName: string;

  container$: Observable<CaLabDockerPsFull>;

  constructor(private labService: CaLabInstanceService) {
  }

  ngOnInit(): void {
    this.container$ = this.labService.getContainerDetails(this.labInstanceId, this.containerName);
  }


}
