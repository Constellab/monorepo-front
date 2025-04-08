import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiSelectResourceDialogComponent } from './li-select-resource-dialog.component';

describe('LiSelectResourceDialogComponent', () => {
  let component: LiSelectResourceDialogComponent;
  let fixture: ComponentFixture<LiSelectResourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectResourceDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiSelectResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
