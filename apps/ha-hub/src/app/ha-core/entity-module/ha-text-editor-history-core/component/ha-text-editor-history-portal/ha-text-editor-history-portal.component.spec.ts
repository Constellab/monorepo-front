import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaTextEditorHistoryPortalComponent } from './ha-text-editor-history-portal.component';

describe('HaTextEditorHistoryPortalComponent', () => {
  let component: HaTextEditorHistoryPortalComponent;
  let fixture: ComponentFixture<HaTextEditorHistoryPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaTextEditorHistoryPortalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HaTextEditorHistoryPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
