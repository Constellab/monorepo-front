import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabVolumeHistoryDialogComponent } from './ca-lab-volume-history-dialog.component';

describe('CaLabVolumeHistoryDialogComponent', () => {
  let component: CaLabVolumeHistoryDialogComponent;
  let fixture: ComponentFixture<CaLabVolumeHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabVolumeHistoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabVolumeHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
