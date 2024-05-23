import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabProcessIoPanelComponent} from './lab-process-io-panel.component';

describe('LabWorkflowNodeResourcesComponent', () => {
  let component: LabProcessIoPanelComponent;
  let fixture: ComponentFixture<LabProcessIoPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabProcessIoPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabProcessIoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
