import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpSpreadsheetHeaderInfoComponent} from './sp-spreadsheet-header-info.component';

describe('SpSpreadsheetHeaderInfoComponent', () => {
  let component: SpSpreadsheetHeaderInfoComponent;
  let fixture: ComponentFixture<SpSpreadsheetHeaderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpSpreadsheetHeaderInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpSpreadsheetHeaderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
