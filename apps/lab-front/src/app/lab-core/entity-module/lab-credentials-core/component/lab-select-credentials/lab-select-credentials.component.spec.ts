import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSelectCredentialsComponent } from './lab-select-credentials.component';

describe('LabSelectCredentialsComponent', () => {
  let component: LabSelectCredentialsComponent;
  let fixture: ComponentFixture<LabSelectCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectCredentialsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
