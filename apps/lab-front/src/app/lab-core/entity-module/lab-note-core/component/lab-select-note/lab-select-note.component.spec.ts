import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabSelectNoteComponent } from './lab-select-note.component';

describe('LabSelectNoteComponent', () => {
  let component: LabSelectNoteComponent;
  let fixture: ComponentFixture<LabSelectNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectNoteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
