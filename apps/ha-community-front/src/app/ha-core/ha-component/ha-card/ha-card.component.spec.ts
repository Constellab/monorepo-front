import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaCardComponent } from './ha-card.component';

describe('HaCardComponentComponent', () => {
  let component: HaCardComponent;
  let fixture: ComponentFixture<HaCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HaCardComponent],
    });
    fixture = TestBed.createComponent(HaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
