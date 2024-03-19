import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaSpaceStorageFormDialogComponent} from './ca-space-storage-form-dialog.component';

describe('CaSpaceStorageFormDialogComponent', () => {
  let component: CaSpaceStorageFormDialogComponent;
  let fixture: ComponentFixture<CaSpaceStorageFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaSpaceStorageFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaSpaceStorageFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
