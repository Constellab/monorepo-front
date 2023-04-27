import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpSpreadsheetSelectionListenerComponent} from './sp-spreadsheet-selection-listener.component';

describe('SpSpreadsheetSelectionInputComponent', () => {
  let component: SpSpreadsheetSelectionListenerComponent;
  let fixture: ComponentFixture<SpSpreadsheetSelectionListenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpSpreadsheetSelectionListenerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpSpreadsheetSelectionListenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
