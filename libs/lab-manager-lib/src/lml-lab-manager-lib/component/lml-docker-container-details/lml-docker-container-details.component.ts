import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LmlDockerContainerSize, LmlDockerPsFull } from '../../model/lml-lab-manager.class';
import { LmlLabManagerService } from '../../lml-lab-manager.service';

/**
 * Component to show the details of a container
 */
@Component({
  selector: 'lml-docker-container-details',
  templateUrl: './lml-docker-container-details.component.html',
  styleUrls: ['./lml-docker-container-details.component.scss'],
})
export class LmlDockerContainerDetailsComponent implements OnInit {

  private labService = inject(LmlLabManagerService);
  @Input({required: true}) containerName: string;

  container$: Observable<LmlDockerPsFull>;
  size$: Observable<LmlDockerContainerSize>;

  ngOnInit(): void {
    this.container$ = this.labService.getContainerDetails(this.containerName);
  }

  getSize(): void {
    this.size$ = this.labService.getContainerSize(this.containerName);
  }
}
