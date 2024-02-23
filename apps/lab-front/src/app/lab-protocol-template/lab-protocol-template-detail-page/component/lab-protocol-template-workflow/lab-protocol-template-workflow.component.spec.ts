import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabProtocolTemplateWorkflowComponent} from './lab-protocol-template-workflow.component';

describe('LabProtocolTemplateWorkflowComponent', () => {
  let component: LabProtocolTemplateWorkflowComponent;
  let fixture: ComponentFixture<LabProtocolTemplateWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabProtocolTemplateWorkflowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabProtocolTemplateWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
