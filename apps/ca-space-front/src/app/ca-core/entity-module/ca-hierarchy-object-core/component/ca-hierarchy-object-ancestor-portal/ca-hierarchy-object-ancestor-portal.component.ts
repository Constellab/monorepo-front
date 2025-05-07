import { Component, inject } from '@angular/core';
import { FL_PORTAL_DATA, FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { CaHierarchyObjectInlineComponent } from '../ca-hierarchy-object-inline/ca-hierarchy-object-inline.component';
import { RouterLink } from '@angular/router';
import { CaDetailRoutePipe } from '../../../../module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { map } from 'rxjs/operators';
import { MatIcon } from '@angular/material/icon';
import { CaHierarchyObjectService } from '../../../../service-api/ca-hierarchy-object.service';

/**
 * Portal to display the ancestor of a hierarchy object
 */
@Component({
  selector: 'ca-hierarchy-object-ancestor-portal',
  imports: [
    FlPortalModule,
    CaHierarchyObjectInlineComponent,
    RouterLink,
    CaDetailRoutePipe,
    FlSectionModule,
    MatIcon,
  ],
  templateUrl: './ca-hierarchy-object-ancestor-portal.component.html',
  styleUrl: './ca-hierarchy-object-ancestor-portal.component.scss',
})
export class CaHierarchyObjectAncestorPortalComponent {
  hierarchyObjectId: string = inject(FL_PORTAL_DATA);

  private hierarchyObjectService = inject(CaHierarchyObjectService);

  ancestors$ = this.hierarchyObjectService
    .getObjectAncestors(this.hierarchyObjectId)
    .pipe(map((ancestors) => ancestors.reverse()));
}
