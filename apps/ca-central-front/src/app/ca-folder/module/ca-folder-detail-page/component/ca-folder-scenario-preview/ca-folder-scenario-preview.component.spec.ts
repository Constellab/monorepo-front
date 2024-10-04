import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderScenarioPreviewComponent } from './ca-folder-scenario-preview.component';

describe('CaFolderScenarioPreviewComponent', () => {
  let component: CaFolderScenarioPreviewComponent;
  let fixture: ComponentFixture<CaFolderScenarioPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaFolderScenarioPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaFolderScenarioPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
