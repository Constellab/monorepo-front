import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaConstellabSuiteListDialogComponent } from './ca-constellab-suite-list-dialog.component';

describe('CaConstellabSuiteListDialogComponent', () => {
  let component: CaConstellabSuiteListDialogComponent;
  let fixture: ComponentFixture<CaConstellabSuiteListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaConstellabSuiteListDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaConstellabSuiteListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
