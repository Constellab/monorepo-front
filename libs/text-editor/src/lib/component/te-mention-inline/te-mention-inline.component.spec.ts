import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeMentionInlineComponent } from './te-mention-inline.component';

describe('TeMentionInlineComponent', () => {
  let component: TeMentionInlineComponent;
  let fixture: ComponentFixture<TeMentionInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeMentionInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeMentionInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
