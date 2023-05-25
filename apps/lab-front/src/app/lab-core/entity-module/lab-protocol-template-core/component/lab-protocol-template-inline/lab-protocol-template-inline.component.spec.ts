import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabProtocolTemplateInlineComponent} from './lab-protocol-template-inline.component';

describe('LabProtocolTemplateInlineComponent', () => {
  let component: LabProtocolTemplateInlineComponent;
  let fixture: ComponentFixture<LabProtocolTemplateInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabProtocolTemplateInlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabProtocolTemplateInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
