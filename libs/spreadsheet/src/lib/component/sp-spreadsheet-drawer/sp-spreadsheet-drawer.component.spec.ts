import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpSpreadsheetDrawerComponent} from './sp-spreadsheet-drawer.component';

describe('SpSpreadsheetDrawerComponent', () => {
  let component: SpSpreadsheetDrawerComponent;
  let fixture: ComponentFixture<SpSpreadsheetDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpSpreadsheetDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpSpreadsheetDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
