import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiTagCheckPropagationComponent } from './li-tag-check-propagation.component';

describe('LabAddTagCheckPropagationComponent', () => {
  let component: LiTagCheckPropagationComponent;
  let fixture: ComponentFixture<LiTagCheckPropagationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiTagCheckPropagationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiTagCheckPropagationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
