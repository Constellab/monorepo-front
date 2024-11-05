import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabResourceNextObjectsPortalComponent } from './lab-resource-next-objects-portal.component';

describe('LabScenariosUsingResourcePortalComponent', () => {
  let component: LabResourceNextObjectsPortalComponent;
  let fixture: ComponentFixture<LabResourceNextObjectsPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabResourceNextObjectsPortalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabResourceNextObjectsPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
