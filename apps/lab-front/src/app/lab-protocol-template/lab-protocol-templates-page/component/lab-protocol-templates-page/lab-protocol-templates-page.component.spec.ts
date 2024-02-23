import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabProtocolTemplatesPageComponent} from './lab-protocol-templates-page.component';

describe('LabProtocolTemplatesPageComponent', () => {
  let component: LabProtocolTemplatesPageComponent;
  let fixture: ComponentFixture<LabProtocolTemplatesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabProtocolTemplatesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabProtocolTemplatesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
