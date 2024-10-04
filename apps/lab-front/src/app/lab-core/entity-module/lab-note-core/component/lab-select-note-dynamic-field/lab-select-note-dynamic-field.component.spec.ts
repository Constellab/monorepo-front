import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabSelectNoteDynamicFieldComponent } from './lab-select-note-dynamic-field.component';

describe('LabSelectNoteDynamicFieldComponent', () => {
  let component: LabSelectNoteDynamicFieldComponent;
  let fixture: ComponentFixture<LabSelectNoteDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectNoteDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectNoteDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
