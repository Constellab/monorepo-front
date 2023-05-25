import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabProtocolTemplateSearchFormComponent} from './lab-protocol-template-search-form.component';

describe('LabProtocolTemplateSearchFormComponent', () => {
  let component: LabProtocolTemplateSearchFormComponent;
  let fixture: ComponentFixture<LabProtocolTemplateSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabProtocolTemplateSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabProtocolTemplateSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
