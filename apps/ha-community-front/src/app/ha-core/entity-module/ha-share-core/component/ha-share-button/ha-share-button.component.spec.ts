import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaShareButtonComponent } from './ha-share-button.component';

describe('HaShareButtonComponent', () => {
  let component: HaShareButtonComponent;
  let fixture: ComponentFixture<HaShareButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaShareButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaShareButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
