import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TeTextEditorBrowserSideComponent} from './te-text-editor-browser-side.component';

describe('TeTextEditorBrowserSideComponent', () => {
  let component: TeTextEditorBrowserSideComponent;
  let fixture: ComponentFixture<TeTextEditorBrowserSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTextEditorBrowserSideComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTextEditorBrowserSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
