import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiResourceSearchFormComponent } from './li-resource-search-form.component';

describe('LiResourceSearchFormComponent', () => {
  let component: LiResourceSearchFormComponent;
  let fixture: ComponentFixture<LiResourceSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceSearchFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiResourceSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
