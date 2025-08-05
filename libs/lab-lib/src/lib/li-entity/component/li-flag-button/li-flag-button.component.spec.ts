import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiFlagButtonComponent } from './li-flag-button.component';

describe('LabHighlightButtonComponent', () => {
  let component: LiFlagButtonComponent;
  let fixture: ComponentFixture<LiFlagButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiFlagButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiFlagButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
