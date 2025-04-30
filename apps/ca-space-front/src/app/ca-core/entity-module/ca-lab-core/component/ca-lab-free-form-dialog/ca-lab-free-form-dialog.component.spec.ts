import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaLabFreeFormDialogComponent } from './ca-lab-free-form-dialog.component';

describe('CaLabFreeFormDialogComponent', () => {
  let component: CaLabFreeFormDialogComponent;
  let fixture: ComponentFixture<CaLabFreeFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabFreeFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabFreeFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
