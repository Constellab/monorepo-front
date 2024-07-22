import { ComponentFixture, TestBed } from '@angular/core/testing';
import {TeTextEditorHistoryModificationComponent} from './te-text-editor-history-modification.component';



describe('TeTextEditorHistoryModificationComponent', () => {
  let component: TeTextEditorHistoryModificationComponent;
  let fixture: ComponentFixture<TeTextEditorHistoryModificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTextEditorHistoryModificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeTextEditorHistoryModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
