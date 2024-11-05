import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpSpreadsheetCellComponent } from './sp-spreadsheet-cell.component';

describe('SpSpreadsheetCellComponent', () => {
  let component: SpSpreadsheetCellComponent;
  let fixture: ComponentFixture<SpSpreadsheetCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpSpreadsheetCellComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpSpreadsheetCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
