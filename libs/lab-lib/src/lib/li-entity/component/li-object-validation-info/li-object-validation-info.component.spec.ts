import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiObjectValidationInfoComponent } from './li-object-validation-info.component';

describe('LiObjectValidationInfoComponent', () => {
  let component: LiObjectValidationInfoComponent;
  let fixture: ComponentFixture<LiObjectValidationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiObjectValidationInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiObjectValidationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
