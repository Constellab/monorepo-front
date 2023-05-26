import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabExperimentInlineComponent} from './lab-experiment-inline.component';

describe('LabExperimentInlineComponent', () => {
  let component: LabExperimentInlineComponent;
  let fixture: ComponentFixture<LabExperimentInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabExperimentInlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabExperimentInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
