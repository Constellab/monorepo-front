import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeTextEditorComponent } from './te-text-editor.component';

describe('TeTextEditorComponent', () => {
  let component: TeTextEditorComponent;
  let fixture: ComponentFixture<TeTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTextEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
