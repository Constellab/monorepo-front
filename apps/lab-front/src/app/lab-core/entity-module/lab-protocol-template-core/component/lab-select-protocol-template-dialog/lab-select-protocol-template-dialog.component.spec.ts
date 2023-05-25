import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabSelectProtocolTemplateDialogComponent} from './lab-select-protocol-template-dialog.component';

describe('LabSelectProtocolTemplateDialogComponent', () => {
  let component: LabSelectProtocolTemplateDialogComponent;
  let fixture: ComponentFixture<LabSelectProtocolTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectProtocolTemplateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectProtocolTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
