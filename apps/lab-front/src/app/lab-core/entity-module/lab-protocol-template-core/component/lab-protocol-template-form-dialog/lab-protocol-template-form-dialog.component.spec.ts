import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabProtocolTemplateFormDialogComponent} from './lab-protocol-template-form-dialog.component';

describe('LabProtocolTemplateFormDialogComponent', () => {
  let component: LabProtocolTemplateFormDialogComponent;
  let fixture: ComponentFixture<LabProtocolTemplateFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabProtocolTemplateFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabProtocolTemplateFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
