import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabLogLinesComponent } from './lab-log-lines.component';

describe('LabLogLinesComponent', () => {
  let component: LabLogLinesComponent;
  let fixture: ComponentFixture<LabLogLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabLogLinesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabLogLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
