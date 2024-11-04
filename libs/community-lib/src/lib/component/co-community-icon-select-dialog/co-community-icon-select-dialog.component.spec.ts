import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoCommunityIconSelectDialogComponent } from './co-community-icon-select-dialog.component';

describe('CoCommunityIconSelectDialogComponent', () => {
  let component: CoCommunityIconSelectDialogComponent;
  let fixture: ComponentFixture<CoCommunityIconSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoCommunityIconSelectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoCommunityIconSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
