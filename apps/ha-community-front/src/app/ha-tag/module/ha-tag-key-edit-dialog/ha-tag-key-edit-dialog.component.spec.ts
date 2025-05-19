import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaTagKeyEditDialogComponent } from './ha-tag-key-edit-dialog.component';

describe('HaTagKeyEditDialogComponent', () => {
  let component: HaTagKeyEditDialogComponent;
  let fixture: ComponentFixture<HaTagKeyEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaTagKeyEditDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaTagKeyEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
