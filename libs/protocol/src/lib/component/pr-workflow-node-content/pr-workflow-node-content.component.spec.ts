import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrWorkflowNodeContentComponent} from './pr-workflow-node-content.component';

describe('PrWorkflowNodeContentComponent', () => {
  let component: PrWorkflowNodeContentComponent;
  let fixture: ComponentFixture<PrWorkflowNodeContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrWorkflowNodeContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrWorkflowNodeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
