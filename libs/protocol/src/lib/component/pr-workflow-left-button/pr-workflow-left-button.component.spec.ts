import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrWorkflowLeftButtonComponent} from './pr-workflow-left-button.component';

describe('PrWorkflowLeftButtonComponent', () => {
  let component: PrWorkflowLeftButtonComponent;
  let fixture: ComponentFixture<PrWorkflowLeftButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrWorkflowLeftButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrWorkflowLeftButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
