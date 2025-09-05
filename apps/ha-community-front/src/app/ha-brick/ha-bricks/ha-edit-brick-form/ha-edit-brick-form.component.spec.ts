import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaEditBrickFormComponent } from './ha-edit-brick-form.component';

describe('HaEditBrickFormComponent', () => {
  let component: HaEditBrickFormComponent;
  let fixture: ComponentFixture<HaEditBrickFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaEditBrickFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaEditBrickFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
