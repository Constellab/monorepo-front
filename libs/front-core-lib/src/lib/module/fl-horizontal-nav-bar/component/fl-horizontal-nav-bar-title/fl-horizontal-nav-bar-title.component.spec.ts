import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlHorizontalNavBarTitleComponent } from './fl-horizontal-nav-bar-title.component';

describe('FlHorizontalNavBarTitleComponent', () => {
  let component: FlHorizontalNavBarTitleComponent;
  let fixture: ComponentFixture<FlHorizontalNavBarTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlHorizontalNavBarTitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlHorizontalNavBarTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
