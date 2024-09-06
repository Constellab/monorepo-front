import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaChatFolderTreeComponent } from './ca-chat-folder-tree.component';

describe('CaChatFolderTreeComponent', () => {
  let component: CaChatFolderTreeComponent;
  let fixture: ComponentFixture<CaChatFolderTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaChatFolderTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaChatFolderTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
