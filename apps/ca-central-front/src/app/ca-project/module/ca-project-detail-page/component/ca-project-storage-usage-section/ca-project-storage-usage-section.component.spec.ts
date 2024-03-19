import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaProjectStorageUsageSectionComponent} from './ca-project-storage-usage-section.component';

describe('CaProjectStorageUsageSectionComponent', () => {
  let component: CaProjectStorageUsageSectionComponent;
  let fixture: ComponentFixture<CaProjectStorageUsageSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaProjectStorageUsageSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaProjectStorageUsageSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
