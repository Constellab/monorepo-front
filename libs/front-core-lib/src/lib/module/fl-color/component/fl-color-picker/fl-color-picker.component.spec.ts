import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlColorPickerComponent } from './fl-color-picker.component';

describe('FlColorPickerComponent', () => {
  let component: FlColorPickerComponent;
  let fixture: ComponentFixture<FlColorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlColorPickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
