import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaFolderFormDialogComponent} from './ca-folder-form-dialog.component';

describe('CaFolderFormDialogComponent', () => {
  let component: CaFolderFormDialogComponent;
  let fixture: ComponentFixture<CaFolderFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaFolderFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaFolderFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
