import { inject, Pipe, PipeTransform } from '@angular/core';
import {
  CaHierarchyObject,
  CaHierarchyObjectTagDatasource,
} from '../../../model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectService } from '../../../service-api/ca-hierarchy-object.service';
import { FlTagDatasource } from '@monorepo/front-core-lib/fl-tag';
import { map } from 'rxjs';

/**
 * Pipe to load the first 4 tags of a hierarchy object
 */
@Pipe({
  name: 'caHierarchyObjectGetTags',
})
export class CaHierarchyObjectGetTagsPipe implements PipeTransform {
  private hierarchyObjectService = inject(CaHierarchyObjectService);

  transform(hierarchyObject: CaHierarchyObject): CaHierarchyObjectTagDatasource {
    if (hierarchyObject == null) return new FlTagDatasource([]);

    return new FlTagDatasource(
      this.hierarchyObjectService.getTags(hierarchyObject.id, 0, 4).pipe(map((result) => result.objects))
    );
  }
}
