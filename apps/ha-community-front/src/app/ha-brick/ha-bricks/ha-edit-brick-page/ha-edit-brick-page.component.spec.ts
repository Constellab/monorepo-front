import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaEditBrickPageComponent } from './ha-edit-brick-page.component';

describe('HaEditBrickPageComponent', () => {
  let component: HaEditBrickPageComponent;
  let fixture: ComponentFixture<HaEditBrickPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaEditBrickPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaEditBrickPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
