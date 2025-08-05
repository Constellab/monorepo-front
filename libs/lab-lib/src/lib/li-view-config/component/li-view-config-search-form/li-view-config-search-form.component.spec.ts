import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiViewConfigSearchFormComponent } from './li-view-config-search-form.component';

describe('LiViewConfigSearchFormComponent', () => {
  let component: LiViewConfigSearchFormComponent;
  let fixture: ComponentFixture<LiViewConfigSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiViewConfigSearchFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiViewConfigSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
