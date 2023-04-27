import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpSpreadsheetHeaderCellComponent } from './sp-spreadsheet-header-cell.component';

describe('SpSpreadsheetHeaderCellComponent', () => {
  let component: SpSpreadsheetHeaderCellComponent;
  let fixture: ComponentFixture<SpSpreadsheetHeaderCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpSpreadsheetHeaderCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpSpreadsheetHeaderCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
