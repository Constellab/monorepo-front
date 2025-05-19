import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaEditAdditionalInfoSpecDialogComponent } from './ha-edit-additional-info-spec-dialog.component';

describe('HaEditAdditionalInfoSpecDialogComponent', () => {
  let component: HaEditAdditionalInfoSpecDialogComponent;
  let fixture: ComponentFixture<HaEditAdditionalInfoSpecDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaEditAdditionalInfoSpecDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaEditAdditionalInfoSpecDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
