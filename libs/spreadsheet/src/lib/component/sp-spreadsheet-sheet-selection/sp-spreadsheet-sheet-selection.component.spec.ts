import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpSpreadsheetSheetSelectionComponent } from './sp-spreadsheet-sheet-selection.component';

describe('SpSpreadsheethseetSheetSelectionComponent', () => {
  let component: SpSpreadsheetSheetSelectionComponent;
  let fixture: ComponentFixture<SpSpreadsheetSheetSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpSpreadsheetSheetSelectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpSpreadsheetSheetSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
