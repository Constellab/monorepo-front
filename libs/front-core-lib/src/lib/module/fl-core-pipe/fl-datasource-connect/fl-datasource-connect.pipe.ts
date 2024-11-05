import { Pipe, PipeTransform } from '@angular/core';
import { FlDatasource } from '../../../model/datasource/fl-datasource.class';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Call connect method of FlDatasource
 */
@Pipe({
  name: 'flDatasourceConnect',
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
