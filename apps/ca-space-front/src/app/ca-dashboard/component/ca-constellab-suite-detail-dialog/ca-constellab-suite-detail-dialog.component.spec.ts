import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaConstellabSuiteDetailDialogComponent } from './ca-constellab-suite-detail-dialog.component';

describe('CaConstellabSuiteDetailDialogComponent', () => {
  let component: CaConstellabSuiteDetailDialogComponent;
  let fixture: ComponentFixture<CaConstellabSuiteDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaConstellabSuiteDetailDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaConstellabSuiteDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
