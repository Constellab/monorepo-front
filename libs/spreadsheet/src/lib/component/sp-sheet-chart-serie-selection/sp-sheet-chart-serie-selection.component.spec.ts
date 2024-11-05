import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpSheetChartSerieSelectionComponent } from './sp-sheet-chart-serie-selection.component';

describe('SpSpreadsheetChartSerieSelectionComponent', () => {
  let component: SpSheetChartSerieSelectionComponent;
  let fixture: ComponentFixture<SpSheetChartSerieSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpSheetChartSerieSelectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpSheetChartSerieSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
