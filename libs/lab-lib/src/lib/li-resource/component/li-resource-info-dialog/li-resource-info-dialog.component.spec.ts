import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiResourceInfoDialogComponent } from './li-resource-info-dialog.component';

describe('LiResourceInfoDialogComponent', () => {
  let component: LiResourceInfoDialogComponent;
  let fixture: ComponentFixture<LiResourceInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceInfoDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiResourceInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
