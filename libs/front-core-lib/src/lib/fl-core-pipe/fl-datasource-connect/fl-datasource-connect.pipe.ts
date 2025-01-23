import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FlDatasource } from '@monorepo/front-core-lib/fl-core';

/**
 * Call connect method of FlDatasource
 */
@Pipe({
    name: 'flDatasourceConnect',
    standalone: false
})
export class FlDatasourceConnectPipe implements PipeTransform {
  transform<T>(value: FlDatasource<T>, slice: number = -1): Observable<T[]> {
    if (value == null) return of([]);

    if (slice > 0) {
      return value.connect().pipe(map((values: T[]) => values.slice(0, slice)));
    }
    return value.connect();
  }
}
