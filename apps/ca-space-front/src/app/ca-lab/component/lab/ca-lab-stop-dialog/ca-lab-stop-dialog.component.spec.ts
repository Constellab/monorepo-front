import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabStopDialogComponent } from './ca-lab-stop-dialog.component';

describe('CaLabStopDialogComponent', () => {
  let component: CaLabStopDialogComponent;
  let fixture: ComponentFixture<CaLabStopDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabStopDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabStopDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
