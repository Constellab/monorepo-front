import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpSpreadsheetComponent } from './sp-spreadsheet.component';

describe('SpSpreadsheetComponent', () => {
  let component: SpSpreadsheetComponent;
  let fixture: ComponentFixture<SpSpreadsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpSpreadsheetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpSpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
