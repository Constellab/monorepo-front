import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabDetailComponent } from './ca-lab-detail.component';

describe('LabDetailCardComponent', () => {
  let component: CaLabDetailComponent;
  let fixture: ComponentFixture<CaLabDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaLabDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
