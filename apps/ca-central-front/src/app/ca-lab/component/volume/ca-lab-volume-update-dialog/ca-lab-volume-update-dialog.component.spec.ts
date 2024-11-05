import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabVolumeUpdateDialogComponent } from './ca-lab-volume-update-dialog.component';

describe('CaLabVolumeUpdateDialogComponent', () => {
  let component: CaLabVolumeUpdateDialogComponent;
  let fixture: ComponentFixture<CaLabVolumeUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabVolumeUpdateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabVolumeUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
