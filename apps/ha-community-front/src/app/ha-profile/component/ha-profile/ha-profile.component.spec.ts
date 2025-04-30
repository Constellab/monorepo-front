import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaProfileComponent } from './ha-profile.component';

describe('HaProfileComponent', () => {
  let component: HaProfileComponent;
  let fixture: ComponentFixture<HaProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
