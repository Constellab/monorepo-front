import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabProtocolTemplateDetailHeaderComponent} from './lab-protocol-template-detail-header.component';

describe('LabProtocolTemplateDetailHeaderComponent', () => {
  let component: LabProtocolTemplateDetailHeaderComponent;
  let fixture: ComponentFixture<LabProtocolTemplateDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabProtocolTemplateDetailHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabProtocolTemplateDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
