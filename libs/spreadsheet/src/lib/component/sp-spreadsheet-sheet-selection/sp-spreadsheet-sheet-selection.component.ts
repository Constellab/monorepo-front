import { ChangeDetectionStrategy, Component, inject,OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Observable } from 'rxjs';

import { SpSheet } from '../../model/sp-sheet.class';
import { SpSpreadsheetState } from '../../state/sp-spreadsheet.state';

/**
 * Component to show the list of sheets with possibility to select one
 */
@Component({
  selector: 'sp-spreadsheet-sheet-selection',
  templateUrl: './sp-spreadsheet-sheet-selection.component.html',
  styleUrls: ['./sp-spreadsheet-sheet-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SpSpreadsheetSheetSelectionComponent implements OnInit {
  private state = inject(SpSpreadsheetState);

  sheets$: Observable<SpSheet[]>;

  formControl: FormControl<number> = new FormControl();

  ngOnInit(): void {
    this.sheets$ = this.state.spreadsheet.getSheets$();

    this.state.spreadsheet.getCurrentSheet$().subscribe((sheet) => {
      if (sheet != null) {
        this.formControl.patchValue(sheet.id);
      }
    });
  }

  selectSpreadsheet(change: MatButtonToggleChange): void {
    this.state.spreadsheet.selectSheet(change.value);
  }
}
