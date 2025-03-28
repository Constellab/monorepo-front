import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiTagFormDialogComponent } from './li-tag-form-dialog.component';

describe('LiTagFormDialogComponent', () => {
  let component: LiTagFormDialogComponent;
  let fixture: ComponentFixture<LiTagFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiTagFormDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiTagFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
