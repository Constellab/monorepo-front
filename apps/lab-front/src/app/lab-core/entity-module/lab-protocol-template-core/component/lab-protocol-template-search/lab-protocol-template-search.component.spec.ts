import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabProtocolTemplateSearchComponent} from './lab-protocol-template-search.component';

describe('LabProtocolTemplateSearchComponent', () => {
  let component: LabProtocolTemplateSearchComponent;
  let fixture: ComponentFixture<LabProtocolTemplateSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabProtocolTemplateSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabProtocolTemplateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
