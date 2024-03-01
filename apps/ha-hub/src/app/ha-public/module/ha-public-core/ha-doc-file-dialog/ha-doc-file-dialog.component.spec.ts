import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HaDocFileDialogComponent } from './ha-doc-file-dialog.component';

describe('HaDocFileDialogComponent', () => {
  let component: HaDocFileDialogComponent;
  let fixture: ComponentFixture<HaDocFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaDocFileDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaDocFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
