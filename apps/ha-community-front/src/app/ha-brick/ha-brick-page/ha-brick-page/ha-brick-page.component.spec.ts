import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaBrickPageComponent } from './ha-brick-page.component';

describe('DaPublicListBricksPageComponent', () => {
  let component: HaBrickPageComponent;
  let fixture: ComponentFixture<HaBrickPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaBrickPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaBrickPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
