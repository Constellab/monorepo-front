import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabProtocolTemplateDetailPageComponent} from './lab-protocol-template-detail-page.component';

describe('LabProtocolTemplateDetailPageComponent', () => {
  let component: LabProtocolTemplateDetailPageComponent;
  let fixture: ComponentFixture<LabProtocolTemplateDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabProtocolTemplateDetailPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabProtocolTemplateDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
