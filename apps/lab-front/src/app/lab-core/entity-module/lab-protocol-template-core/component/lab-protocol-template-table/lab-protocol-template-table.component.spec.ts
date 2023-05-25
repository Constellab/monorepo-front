import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabProtocolTemplateTableComponent} from './lab-protocol-template-table.component';

describe('LabProtocolTemplateTableComponent', () => {
  let component: LabProtocolTemplateTableComponent;
  let fixture: ComponentFixture<LabProtocolTemplateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabProtocolTemplateTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabProtocolTemplateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
