import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaBrickDescriptionPageComponent } from './ha-brick-description-page.component';

describe('HaPublicBrickDescriptionPageComponent', () => {
  let component: HaBrickDescriptionPageComponent;
  let fixture: ComponentFixture<HaBrickDescriptionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaBrickDescriptionPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaBrickDescriptionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
