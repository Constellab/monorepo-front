import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabImportResourceFromLinkComponent } from './lab-import-resource-from-link.component';

describe('LabImportResourceFromLabComponent', () => {
  let component: LabImportResourceFromLinkComponent;
  let fixture: ComponentFixture<LabImportResourceFromLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabImportResourceFromLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabImportResourceFromLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
