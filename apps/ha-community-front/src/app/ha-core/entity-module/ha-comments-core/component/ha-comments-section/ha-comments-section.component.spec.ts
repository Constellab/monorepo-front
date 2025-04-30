import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaCommentsSectionComponent } from './ha-comments-section.component';

describe('HaCommentsSectionComponent', () => {
  let component: HaCommentsSectionComponent;
  let fixture: ComponentFixture<HaCommentsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaCommentsSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaCommentsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
