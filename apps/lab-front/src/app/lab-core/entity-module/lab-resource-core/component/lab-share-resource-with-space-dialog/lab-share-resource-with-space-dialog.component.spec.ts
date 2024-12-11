import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabShareResourceWithSpaceDialogComponent } from './lab-share-resource-with-space-dialog.component';

describe('LabShareResourceWithSpaceComponent', () => {
  let component: LabShareResourceWithSpaceDialogComponent;
  let fixture: ComponentFixture<LabShareResourceWithSpaceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabShareResourceWithSpaceDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabShareResourceWithSpaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
