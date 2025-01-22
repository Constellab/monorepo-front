import { Pipe, PipeTransform, inject } from '@angular/core';
import { mergeMap, Observable, of } from 'rxjs';
import { SpSpreadsheetState } from '../state/sp-spreadsheet.state';

/**
 * Pipe to display the value of a celle header (row or column)
 */
@Pipe({
  name: 'SpCellHeader',
  standalone: false,
})
export class SpCellHeaderPipe implements PipeTransform {
  private state = inject(SpSpreadsheetState);

  transform(index: number, type: 'row' | 'column'): Observable<string> {
    if (index == null || index < 0) {
      return of('');
    }
    if (type === 'row') {
      return this.state.currentSheet$.pipe(mergeMap((sheet) => sheet.getRowOffsetIndexName$(index)));
    } else {
      return this.state.currentSheet$.pipe(mergeMap((sheet) => sheet.getColumnOffsetIndexName$(index)));
    }
  }
}
