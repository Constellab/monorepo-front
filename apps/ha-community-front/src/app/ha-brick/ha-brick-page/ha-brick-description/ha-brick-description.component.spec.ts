import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaBrickDescriptionComponent } from './ha-brick-description.component';

describe('HaPublicBrickDescriptionPageComponent', () => {
  let component: HaBrickDescriptionComponent;
  let fixture: ComponentFixture<HaBrickDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaBrickDescriptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaBrickDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
