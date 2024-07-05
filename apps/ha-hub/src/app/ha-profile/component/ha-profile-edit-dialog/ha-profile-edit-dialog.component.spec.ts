import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaProfileEditDialogComponent } from './ha-profile-edit-dialog.component';

describe('HaProfileEditDialogComponent', () => {
  let component: HaProfileEditDialogComponent;
  let fixture: ComponentFixture<HaProfileEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaProfileEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HaProfileEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
