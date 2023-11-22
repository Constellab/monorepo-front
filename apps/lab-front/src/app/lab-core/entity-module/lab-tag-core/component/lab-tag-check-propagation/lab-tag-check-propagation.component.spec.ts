import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabTagCheckPropagationComponent} from './lab-tag-check-propagation.component';

describe('LabAddTagCheckPropagationComponent', () => {
  let component: LabTagCheckPropagationComponent;
  let fixture: ComponentFixture<LabTagCheckPropagationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabTagCheckPropagationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabTagCheckPropagationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
