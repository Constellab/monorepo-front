import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabImportExperimentFromLinkComponent } from './lab-import-experiment-from-link.component';

describe('LabImportExperimentFromLinkComponent', () => {
  let component: LabImportExperimentFromLinkComponent;
  let fixture: ComponentFixture<LabImportExperimentFromLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabImportExperimentFromLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LabImportExperimentFromLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
