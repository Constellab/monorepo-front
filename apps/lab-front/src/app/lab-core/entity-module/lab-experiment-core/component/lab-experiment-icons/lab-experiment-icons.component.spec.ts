import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabExperimentIconsComponent } from './lab-experiment-icons.component';

describe('LabExperimentIconsComponent', () => {
  let component: LabExperimentIconsComponent;
  let fixture: ComponentFixture<LabExperimentIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabExperimentIconsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LabExperimentIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
