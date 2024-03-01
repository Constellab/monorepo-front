import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabExperimentsUsingResourcePortalComponent} from './lab-experiments-using-resource-portal.component';

describe('LabExperimentsUsingResourcePortalComponent', () => {
  let component: LabExperimentsUsingResourcePortalComponent;
  let fixture: ComponentFixture<LabExperimentsUsingResourcePortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabExperimentsUsingResourcePortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabExperimentsUsingResourcePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
