import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSyncImportedCommunityTagsDialogComponent } from './li-sync-imported-community-tags-dialog.component';

describe('LiSyncImportedCommunityTagsDialogComponent', () => {
  let component: LiSyncImportedCommunityTagsDialogComponent;
  let fixture: ComponentFixture<LiSyncImportedCommunityTagsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiSyncImportedCommunityTagsDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LiSyncImportedCommunityTagsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
