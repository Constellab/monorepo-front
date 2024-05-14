import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaProjectCommentComponent} from './ca-project-comment.component';

describe('CaCommentDivComponent', () => {
  let component: CaProjectCommentComponent;
  let fixture: ComponentFixture<CaProjectCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaProjectCommentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaProjectCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
