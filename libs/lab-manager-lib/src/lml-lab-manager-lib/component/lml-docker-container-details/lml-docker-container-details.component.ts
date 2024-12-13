import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LmlDockerContainerSize, LmlDockerPsFull } from '../../model/lml-lab-manager.class';
import { LmlLabManagerApiService } from '../../lml-lab-manager-api.service';

/**
 * Component to show the details of a container
 */
@Component({
  selector: 'lml-docker-container-details',
  templateUrl: './lml-docker-container-details.component.html',
  styleUrls: ['./lml-docker-container-details.component.scss'],
})
export class LmlDockerContainerDetailsComponent implements OnInit {
  @Input() containerName: string;

  container$: Observable<LmlDockerPsFull>;
  size$: Observable<LmlDockerContainerSize>;

  constructor(private labService: LmlLabManagerApiService) {}

  ngOnInit(): void {
    this.container$ = this.labService.getContainerDetails(this.containerName);
  }

  getSize(): void {
    this.size$ = this.labService.getContainerSize(this.containerName);
  }
}
