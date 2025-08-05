import { Component, inject,OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';

import { PrWorkflowLayer } from '../../model/workflow/pr-workflow-layer.class';
import { PrWorkflowManagerState } from '../../state/pr-workflow-manager-state';

/**
 * Component to show the current layer hierarchy
 */
@Component({
  selector: 'pr-workflow-layers-breadcrumb',
  templateUrl: './pr-workflow-layers-breadcrumb.component.html',
  styleUrls: ['./pr-workflow-layers-breadcrumb.component.scss'],
  standalone: false,
})
export class PrWorkflowLayersBreadcrumbComponent implements OnInit {
  private workflowManager = inject(PrWorkflowManagerState);

  layers$: Observable<PrWorkflowLayer[]>;
  hasMultipleLayers$: Observable<boolean>;

  ngOnInit(): void {
    this.layers$ = this.workflowManager.getCurrentLayerHierarchy$();
    this.hasMultipleLayers$ = this.layers$.pipe(map((layers) => layers?.length > 1));
  }

  selectLayer(layerId: string): void {
    this.workflowManager.selectLayer(layerId);
  }
}
