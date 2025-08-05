import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiTagSearchComponent } from './li-tag-search.component';

describe('LiTagSearchComponent', () => {
  let component: LiTagSearchComponent;
  let fixture: ComponentFixture<LiTagSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiTagSearchComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LiTagSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
