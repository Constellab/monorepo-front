import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpSheetRangesInputComponent} from './sp-sheet-ranges-input.component';

describe('SpSpreadsheetRangesInputComponent', () => {
  let component: SpSheetRangesInputComponent;
  let fixture: ComponentFixture<SpSheetRangesInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpSheetRangesInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpSheetRangesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
