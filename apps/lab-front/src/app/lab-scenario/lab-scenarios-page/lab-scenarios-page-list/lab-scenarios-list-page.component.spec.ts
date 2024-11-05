import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenariosListPageComponent } from './lab-scenarios-list-page.component';

describe('BioxScenariosPageComponent', () => {
  let component: LabScenariosListPageComponent;
  let fixture: ComponentFixture<LabScenariosListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabScenariosListPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabScenariosListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
