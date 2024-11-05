import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabImportScenarioFromLinkComponent } from './lab-import-scenario-from-link.component';

describe('LabImportScenarioFromLinkComponent', () => {
  let component: LabImportScenarioFromLinkComponent;
  let fixture: ComponentFixture<LabImportScenarioFromLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabImportScenarioFromLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabImportScenarioFromLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
