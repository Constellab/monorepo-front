import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaBrickVersionsTableComponent } from './ha-brick-versions-table.component';

describe('HaPublicBrickVersionsTableComponent', () => {
  let component: HaBrickVersionsTableComponent;
  let fixture: ComponentFixture<HaBrickVersionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaBrickVersionsTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaBrickVersionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
