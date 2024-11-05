import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderDetailRightPanelComponent } from './ca-folder-detail-right-panel.component';

describe('CaFolderDetailRightPanelComponent', () => {
  let component: CaFolderDetailRightPanelComponent;
  let fixture: ComponentFixture<CaFolderDetailRightPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderDetailRightPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaFolderDetailRightPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
