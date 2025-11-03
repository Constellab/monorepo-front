import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaAppCardComponent } from './ca-app-card.component';

describe('CaAppCardComponent', () => {
  let component: CaAppCardComponent;
  let fixture: ComponentFixture<CaAppCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaAppCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaAppCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
