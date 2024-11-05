import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeTitleCaptionComponent } from './te-title-caption.component';

describe('CaTextEditorTitleCaptionComponent', () => {
  let component: TeTitleCaptionComponent;
  let fixture: ComponentFixture<TeTitleCaptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTitleCaptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeTitleCaptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
