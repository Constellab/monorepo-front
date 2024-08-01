import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaTextEditorRightSidePanelComponent } from './ha-text-editor-right-side-panel.component';

describe('HaTextEditorRightSidePanelComponent', () => {
  let component: HaTextEditorRightSidePanelComponent;
  let fixture: ComponentFixture<HaTextEditorRightSidePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaTextEditorRightSidePanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HaTextEditorRightSidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
