import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabDetailPageComponent } from './ca-lab-detail-page.component';

describe('LabDetailPageComponent', () => {
  let component: CaLabDetailPageComponent;
  let fixture: ComponentFixture<CaLabDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabDetailPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaLabDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
