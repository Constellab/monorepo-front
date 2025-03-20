import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeEditBlockMetadataDialogComponent } from './te-edit-block-metadata-dialog.component';

describe('TeEditBlockMetadataDialogComponent', () => {
  let component: TeEditBlockMetadataDialogComponent;
  let fixture: ComponentFixture<TeEditBlockMetadataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeEditBlockMetadataDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeEditBlockMetadataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
