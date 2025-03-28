import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiSelectNoteDynamicFieldComponent } from './li-select-note-dynamic-field.component';

describe('LiSelectNoteDynamicFieldComponent', () => {
  let component: LiSelectNoteDynamicFieldComponent;
  let fixture: ComponentFixture<LiSelectNoteDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectNoteDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSelectNoteDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
