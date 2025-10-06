import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaBrickVersionsComponent } from './ha-brick-versions.component';

describe('HaPublicVersionsPageComponent', () => {
  let component: HaBrickVersionsComponent;
  let fixture: ComponentFixture<HaBrickVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaBrickVersionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaBrickVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
