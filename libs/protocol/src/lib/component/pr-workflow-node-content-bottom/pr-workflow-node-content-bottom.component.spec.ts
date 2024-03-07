import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrWorkflowNodeContentBottomComponent} from './pr-workflow-node-content-bottom.component';

describe('PrWorkflowBottomContentComponent', () => {
  let component: PrWorkflowNodeContentBottomComponent;
  let fixture: ComponentFixture<PrWorkflowNodeContentBottomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrWorkflowNodeContentBottomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrWorkflowNodeContentBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
