import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderChatRightPanelComponent } from './ca-folder-chat-right-panel.component';

describe('CaFolderCommentsComponent', () => {
  let component: CaFolderChatRightPanelComponent;
  let fixture: ComponentFixture<CaFolderChatRightPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderChatRightPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaFolderChatRightPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
