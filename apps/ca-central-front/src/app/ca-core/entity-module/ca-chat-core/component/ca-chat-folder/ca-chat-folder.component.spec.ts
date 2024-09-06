import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaChatFolderComponent } from './ca-chat-folder.component';

describe('CaChatFolderComponent', () => {
  let component: CaChatFolderComponent;
  let fixture: ComponentFixture<CaChatFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaChatFolderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaChatFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
