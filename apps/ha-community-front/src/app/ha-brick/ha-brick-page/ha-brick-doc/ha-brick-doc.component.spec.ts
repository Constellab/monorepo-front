import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaBrickDocComponent } from './ha-brick-doc.component';

describe('HaPublicDocPageComponent', () => {
  let component: HaBrickDocComponent;
  let fixture: ComponentFixture<HaBrickDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaBrickDocComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaBrickDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
