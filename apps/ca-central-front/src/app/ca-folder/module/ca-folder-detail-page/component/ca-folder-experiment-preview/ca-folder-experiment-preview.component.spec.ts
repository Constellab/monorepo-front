import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaFolderExperimentPreviewComponent} from './ca-folder-experiment-preview.component';

describe('CaFolderExperimentPreviewComponent', () => {
  let component: CaFolderExperimentPreviewComponent;
  let fixture: ComponentFixture<CaFolderExperimentPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaFolderExperimentPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaFolderExperimentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
