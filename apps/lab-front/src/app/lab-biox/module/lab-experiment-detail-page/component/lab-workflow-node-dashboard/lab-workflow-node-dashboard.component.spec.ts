import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabWorkflowNodeDashboardComponent} from './lab-workflow-node-dashboard.component';

describe('LabWorkflowNodeDashboardComponent', () => {
  let component: LabWorkflowNodeDashboardComponent;
  let fixture: ComponentFixture<LabWorkflowNodeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabWorkflowNodeDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabWorkflowNodeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
