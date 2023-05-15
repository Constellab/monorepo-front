import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabWorkflowNodeIoComponent} from './lab-workflow-node-io.component';

describe('LabWorkflowNodeResourceComponent', () => {
  let component: LabWorkflowNodeIoComponent;
  let fixture: ComponentFixture<LabWorkflowNodeIoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabWorkflowNodeIoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabWorkflowNodeIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
