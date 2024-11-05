import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSelectTypeComponent } from './lab-select-type.component';

describe('LabSelectTypeComponent', () => {
  let component: LabSelectTypeComponent;
  let fixture: ComponentFixture<LabSelectTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
