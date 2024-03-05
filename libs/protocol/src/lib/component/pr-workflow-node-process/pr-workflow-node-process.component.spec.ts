import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrWorkflowNodeProcessComponent} from './pr-workflow-node-process.component';

describe('PrWorkflowNodeComponent', () => {
  let component: PrWorkflowNodeProcessComponent;
  let fixture: ComponentFixture<PrWorkflowNodeProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrWorkflowNodeProcessComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrWorkflowNodeProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
