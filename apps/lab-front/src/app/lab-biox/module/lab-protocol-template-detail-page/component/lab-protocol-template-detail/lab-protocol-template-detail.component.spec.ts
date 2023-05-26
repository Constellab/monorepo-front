import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabProtocolTemplateDetailComponent} from './lab-protocol-template-detail.component';

describe('LabProtocolTemplateDetailComponent', () => {
  let component: LabProtocolTemplateDetailComponent;
  let fixture: ComponentFixture<LabProtocolTemplateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabProtocolTemplateDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabProtocolTemplateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
