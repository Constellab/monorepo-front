import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiActivitySearchComponent } from './li-activity-search.component';

describe('LiActivitySearchComponent', () => {
  let component: LiActivitySearchComponent;
  let fixture: ComponentFixture<LiActivitySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiActivitySearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiActivitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
