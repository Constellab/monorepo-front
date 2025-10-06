import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaEditBrickDialogComponent } from './ha-edit-brick-dialog.component';

describe('HaPublicEditBrickDialogComponent', () => {
  let component: HaEditBrickDialogComponent;
  let fixture: ComponentFixture<HaEditBrickDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaEditBrickDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaEditBrickDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
