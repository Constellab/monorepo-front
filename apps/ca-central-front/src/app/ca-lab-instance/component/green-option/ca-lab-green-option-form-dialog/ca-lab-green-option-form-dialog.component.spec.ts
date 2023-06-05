import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaLabGreenOptionFormDialogComponent} from './ca-lab-green-option-form-dialog.component';

describe('CaLabGreenOptionFormDialogComponent', () => {
  let component: CaLabGreenOptionFormDialogComponent;
  let fixture: ComponentFixture<CaLabGreenOptionFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabGreenOptionFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabGreenOptionFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
