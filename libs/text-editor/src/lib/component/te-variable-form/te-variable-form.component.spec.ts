import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TeVariableFormComponent} from './te-variable-form.component';

describe('TeVariableFormComponent', () => {
  let component: TeVariableFormComponent;
  let fixture: ComponentFixture<TeVariableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeVariableFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeVariableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
