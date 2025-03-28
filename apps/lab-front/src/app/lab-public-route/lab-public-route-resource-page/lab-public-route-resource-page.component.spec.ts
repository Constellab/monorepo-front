import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabPublicRouteResourcePageComponent } from './lab-public-route-resource-page.component';

describe('LabOpenRouteResourcePageComponent', () => {
  let component: LabPublicRouteResourcePageComponent;
  let fixture: ComponentFixture<LabPublicRouteResourcePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabPublicRouteResourcePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabPublicRouteResourcePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
