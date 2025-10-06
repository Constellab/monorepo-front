import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaBrickTechDocComponent } from './ha-brick-tech-doc.component';

describe('HaPublicTechDocComponent', () => {
  let component: HaBrickTechDocComponent;
  let fixture: ComponentFixture<HaBrickTechDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaBrickTechDocComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaBrickTechDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
