import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

/**
 * Useful for the hierarchy object links. It keeps the showTree query params and remove others
 */
@Pipe({
  name: 'caHierarchyObjectQueryParams'
})
export class CaHierarchyObjectQueryParamsPipe implements PipeTransform {

  constructor(private route: ActivatedRoute) {
  }

  transform(value: Record<string, string>): Observable<Record<string, string>> {
    return this.route.queryParams.pipe(
      map(params => {
        const queryParams = {...value};

        // force to keep the show tree value
        if (params.showTree != null) {
          queryParams.showTree = params.showTree;
        }

        return queryParams;
      })
    );
  }

}
