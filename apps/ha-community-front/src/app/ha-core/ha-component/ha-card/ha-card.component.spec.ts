import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaCardComponentComponent } from './ha-card.component';

describe('HaCardComponentComponent', () => {
  let component: HaCardComponentComponent;
  let fixture: ComponentFixture<HaCardComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HaCardComponentComponent],
    });
    fixture = TestBed.createComponent(HaCardComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
