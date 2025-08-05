import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiResourceSearchComponent } from './li-resource-search.component';

describe('LiResourceSearchComponent', () => {
  let component: LiResourceSearchComponent;
  let fixture: ComponentFixture<LiResourceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiResourceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
