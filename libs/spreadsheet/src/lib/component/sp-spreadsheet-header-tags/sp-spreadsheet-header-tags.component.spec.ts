import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpSpreadsheetHeaderTagsComponent } from './sp-spreadsheet-header-tags.component';

describe('SpSpreadsheetHeaderTagsComponent', () => {
  let component: SpSpreadsheetHeaderTagsComponent;
  let fixture: ComponentFixture<SpSpreadsheetHeaderTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpSpreadsheetHeaderTagsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpSpreadsheetHeaderTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
