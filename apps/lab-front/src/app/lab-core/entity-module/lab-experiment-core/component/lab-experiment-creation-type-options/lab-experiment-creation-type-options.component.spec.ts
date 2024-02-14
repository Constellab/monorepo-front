import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabExperimentCreationTypeOptionsComponent} from './lab-experiment-creation-type-options.component';

describe('BioxExperimentTypeOptionsComponent', () => {
  let component: LabExperimentCreationTypeOptionsComponent;
  let fixture: ComponentFixture<LabExperimentCreationTypeOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabExperimentCreationTypeOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabExperimentCreationTypeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
