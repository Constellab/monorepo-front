import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiTypeSearchComponent } from './li-type-search.component';

describe('LiTypeSearchComponent', () => {
  let component: LiTypeSearchComponent;
  let fixture: ComponentFixture<LiTypeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiTypeSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiTypeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
