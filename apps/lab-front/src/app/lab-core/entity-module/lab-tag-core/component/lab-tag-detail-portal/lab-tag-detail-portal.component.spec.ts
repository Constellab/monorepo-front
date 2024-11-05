import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabTagDetailPortalComponent } from './lab-tag-detail-portal.component';

describe('LabTagDetailPortalComponent', () => {
  let component: LabTagDetailPortalComponent;
  let fixture: ComponentFixture<LabTagDetailPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabTagDetailPortalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabTagDetailPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
