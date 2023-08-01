import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabProjectSelectPortalComponent} from './lab-project-select-portal.component';

describe('LabProjectSelectPortalComponent', () => {
  let component: LabProjectSelectPortalComponent;
  let fixture: ComponentFixture<LabProjectSelectPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabProjectSelectPortalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabProjectSelectPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
