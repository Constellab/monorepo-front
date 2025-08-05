import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiViewConfigSearchComponent } from './li-view-config-search.component';

describe('LiViewConfigSearchComponent', () => {
  let component: LiViewConfigSearchComponent;
  let fixture: ComponentFixture<LiViewConfigSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiViewConfigSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiViewConfigSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
