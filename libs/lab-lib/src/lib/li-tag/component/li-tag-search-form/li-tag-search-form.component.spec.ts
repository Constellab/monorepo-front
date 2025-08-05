import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiTagSearchFormComponent } from './li-tag-search-form.component';

describe('LiTagSearchFormComponent', () => {
  let component: LiTagSearchFormComponent;
  let fixture: ComponentFixture<LiTagSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiTagSearchFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LiTagSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
