import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAddVersionDialogComponent } from './ha-add-version-dialog.component';

describe('HaAddVersionDialogComponent', () => {
  let component: HaAddVersionDialogComponent;
  let fixture: ComponentFixture<HaAddVersionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaAddVersionDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaAddVersionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
