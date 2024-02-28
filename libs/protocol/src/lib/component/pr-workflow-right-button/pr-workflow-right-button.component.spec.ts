import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrWorkflowRightButtonComponent} from './pr-workflow-right-button.component';

describe('PrWorkflowRightButtonComponent', () => {
  let component: PrWorkflowRightButtonComponent;
  let fixture: ComponentFixture<PrWorkflowRightButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrWorkflowRightButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrWorkflowRightButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
