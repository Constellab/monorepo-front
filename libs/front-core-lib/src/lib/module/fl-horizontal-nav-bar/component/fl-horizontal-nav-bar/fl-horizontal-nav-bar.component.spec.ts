import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlHorizontalNavBarComponent } from './fl-horizontal-nav-bar.component';

describe('FlHorizontalNavBarComponent', () => {
  let component: FlHorizontalNavBarComponent;
  let fixture: ComponentFixture<FlHorizontalNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlHorizontalNavBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlHorizontalNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
