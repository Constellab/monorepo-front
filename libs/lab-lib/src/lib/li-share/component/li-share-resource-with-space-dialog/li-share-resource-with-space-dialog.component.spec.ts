import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiShareResourceWithSpaceDialogComponent } from './li-share-resource-with-space-dialog.component';

describe('LabShareResourceWithSpaceComponent', () => {
  let component: LiShareResourceWithSpaceDialogComponent;
  let fixture: ComponentFixture<LiShareResourceWithSpaceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiShareResourceWithSpaceDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiShareResourceWithSpaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
