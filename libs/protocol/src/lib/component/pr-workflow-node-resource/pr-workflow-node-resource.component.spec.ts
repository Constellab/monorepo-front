import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrWorkflowNodeResourceComponent} from './pr-workflow-node-resource.component';

describe('PrWorkflowNodeResourceComponent', () => {
  let component: PrWorkflowNodeResourceComponent;
  let fixture: ComponentFixture<PrWorkflowNodeResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrWorkflowNodeResourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrWorkflowNodeResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
