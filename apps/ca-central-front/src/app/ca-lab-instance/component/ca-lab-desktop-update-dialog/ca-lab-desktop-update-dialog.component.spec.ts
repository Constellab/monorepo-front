import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaLabDesktopUpdateDialogComponent} from './ca-lab-desktop-update-dialog.component';

describe('LabInstanceUpdateNameDialogComponent', () => {
  let component: CaLabDesktopUpdateDialogComponent;
  let fixture: ComponentFixture<CaLabDesktopUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaLabDesktopUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaLabDesktopUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
