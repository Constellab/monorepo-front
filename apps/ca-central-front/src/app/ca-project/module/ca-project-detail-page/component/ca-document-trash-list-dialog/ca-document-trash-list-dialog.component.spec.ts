import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaDocumentTrashListDialogComponent} from './ca-document-trash-list-dialog.component';

describe('CaDocumentTrashListDialogComponent', () => {
  let component: CaDocumentTrashListDialogComponent;
  let fixture: ComponentFixture<CaDocumentTrashListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaDocumentTrashListDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaDocumentTrashListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
