import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabExperimentSearchFormComponent} from './lab-experiment-search-form.component';

describe('BioxExperimentAdvancedSearchFormComponent', () => {
  let component: LabExperimentSearchFormComponent;
  let fixture: ComponentFixture<LabExperimentSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabExperimentSearchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabExperimentSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
