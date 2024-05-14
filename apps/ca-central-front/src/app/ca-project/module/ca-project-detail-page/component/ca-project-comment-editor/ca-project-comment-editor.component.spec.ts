import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaProjectCommentEditorComponent} from './ca-project-comment-editor.component';

describe('CaProjectCommentEditorComponent', () => {
  let component: CaProjectCommentEditorComponent;
  let fixture: ComponentFixture<CaProjectCommentEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaProjectCommentEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaProjectCommentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
