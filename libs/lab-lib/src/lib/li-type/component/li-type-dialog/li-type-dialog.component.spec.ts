import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiTypeDialogComponent } from './li-type-dialog.component';

describe('LiProcessTypePortalComponent', () => {
  let component: LiTypeDialogComponent;
  let fixture: ComponentFixture<LiTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiTypeDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
