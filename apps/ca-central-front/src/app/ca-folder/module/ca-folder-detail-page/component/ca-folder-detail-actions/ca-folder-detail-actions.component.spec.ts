import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderDetailActionsComponent } from './ca-folder-detail-actions.component';

describe('CaFolderDetailActionsComponent', () => {
  let component: CaFolderDetailActionsComponent;
  let fixture: ComponentFixture<CaFolderDetailActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderDetailActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaFolderDetailActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
