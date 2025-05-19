import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaTagValueEditDialogComponent } from './ha-tag-value-edit-dialog.component';

describe('HaTagValueEditDialogComponent', () => {
  let component: HaTagValueEditDialogComponent;
  let fixture: ComponentFixture<HaTagValueEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaTagValueEditDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaTagValueEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
