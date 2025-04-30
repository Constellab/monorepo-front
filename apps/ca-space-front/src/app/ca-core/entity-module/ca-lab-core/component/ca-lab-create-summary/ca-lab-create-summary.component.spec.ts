import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabCreateSummaryComponent } from './ca-lab-create-summary.component';

describe('CaCreateLabSummaryComponent', () => {
  let component: CaLabCreateSummaryComponent;
  let fixture: ComponentFixture<CaLabCreateSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabCreateSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabCreateSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
