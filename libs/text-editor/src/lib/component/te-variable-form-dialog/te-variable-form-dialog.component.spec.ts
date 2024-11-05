import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeVariableFormDialogComponent } from './te-variable-form-dialog.component';

describe('TeVariableFormComponent', () => {
  let component: TeVariableFormDialogComponent;
  let fixture: ComponentFixture<TeVariableFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeVariableFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeVariableFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
