import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FlUploadImageDialogComponent } from './fl-upload-image-dialog.component';

describe('FlReshapeImageDialogComponent', () => {
  let component: FlUploadImageDialogComponent;
  let fixture: ComponentFixture<FlUploadImageDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FlUploadImageDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlUploadImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
