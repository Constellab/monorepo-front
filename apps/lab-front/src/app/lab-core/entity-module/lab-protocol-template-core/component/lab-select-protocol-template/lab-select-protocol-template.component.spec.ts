import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabSelectProtocolTemplateComponent} from './lab-select-protocol-template.component';

describe('LabSelectProtocolTemplateComponent', () => {
  let component: LabSelectProtocolTemplateComponent;
  let fixture: ComponentFixture<LabSelectProtocolTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectProtocolTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectProtocolTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
