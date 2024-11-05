import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpSpreadsheetCellInfoComponent } from './sp-spreadsheet-cell-info.component';

describe('SpSpreadsheetCellInfoComponent', () => {
  let component: SpSpreadsheetCellInfoComponent;
  let fixture: ComponentFixture<SpSpreadsheetCellInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpSpreadsheetCellInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpSpreadsheetCellInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
