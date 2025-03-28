import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiSelectCredentialsDynamicFieldComponent } from './li-select-credentials-dynamic-field.component';

describe('LiSelectCredentialsDynamicFieldComponent', () => {
  let component: LiSelectCredentialsDynamicFieldComponent;
  let fixture: ComponentFixture<LiSelectCredentialsDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectCredentialsDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSelectCredentialsDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
