import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabOpenRouteResourcePageComponent } from './lab-open-route-resource-page.component';

describe('LabOpenRouteResourcePageComponent', () => {
  let component: LabOpenRouteResourcePageComponent;
  let fixture: ComponentFixture<LabOpenRouteResourcePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabOpenRouteResourcePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabOpenRouteResourcePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
