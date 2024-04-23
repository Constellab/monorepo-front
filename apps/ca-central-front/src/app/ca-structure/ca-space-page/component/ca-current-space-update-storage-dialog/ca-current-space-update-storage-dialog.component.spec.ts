import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaCurrentSpaceUpdateStorageDialogComponent} from './ca-current-space-update-storage-dialog.component';

describe('CaCurrentSpaceUpdateStorageDialogComponent', () => {
  let component: CaCurrentSpaceUpdateStorageDialogComponent;
  let fixture: ComponentFixture<CaCurrentSpaceUpdateStorageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaCurrentSpaceUpdateStorageDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaCurrentSpaceUpdateStorageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
