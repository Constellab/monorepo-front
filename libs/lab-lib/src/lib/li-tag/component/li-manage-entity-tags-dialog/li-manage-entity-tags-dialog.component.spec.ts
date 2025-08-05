import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiManageEntityTagsDialogComponent } from './li-manage-entity-tags-dialog.component';

describe('LabAddTagToEntityDialogComponent', () => {
  let component: LiManageEntityTagsDialogComponent;
  let fixture: ComponentFixture<LiManageEntityTagsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiManageEntityTagsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiManageEntityTagsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
