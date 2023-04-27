import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpSheetChartSelectionComponent} from './sp-sheet-chart-selection.component';

describe('SpSpreadsheetChartSelectionComponent', () => {
  let component: SpSheetChartSelectionComponent;
  let fixture: ComponentFixture<SpSheetChartSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpSheetChartSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpSheetChartSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
