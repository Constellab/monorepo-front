import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabWorkflowNodeIoPanelComponent} from './lab-workflow-node-io-panel.component';

describe('LabWorkflowNodeResourcesComponent', () => {
  let component: LabWorkflowNodeIoPanelComponent;
  let fixture: ComponentFixture<LabWorkflowNodeIoPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabWorkflowNodeIoPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabWorkflowNodeIoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
