import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FlAddTagInputComponent} from './fl-add-tag-input.component';

describe('FlTagInputTwoComponent', () => {
  let component: FlAddTagInputComponent;
  let fixture: ComponentFixture<FlAddTagInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlAddTagInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlAddTagInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
