import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabMonitoringTagsPageComponent } from './lab-monitoring-tags-page.component';

describe('LabMonitoringTagsPageComponent', () => {
  let component: LabMonitoringTagsPageComponent;
  let fixture: ComponentFixture<LabMonitoringTagsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabMonitoringTagsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabMonitoringTagsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
