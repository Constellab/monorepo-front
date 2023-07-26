import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabResourceChildrenTabsComponent} from './lab-resource-children-tabs.component';

describe('LabResourceChildrenTabsComponent', () => {
  let component: LabResourceChildrenTabsComponent;
  let fixture: ComponentFixture<LabResourceChildrenTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabResourceChildrenTabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabResourceChildrenTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
