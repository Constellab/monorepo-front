import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabProcessDashboardComponent } from './lab-process-dashboard.component';

describe('LabWorkflowNodeDashboardComponent', () => {
  let component: LabProcessDashboardComponent;
  let fixture: ComponentFixture<LabProcessDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabProcessDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabProcessDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
