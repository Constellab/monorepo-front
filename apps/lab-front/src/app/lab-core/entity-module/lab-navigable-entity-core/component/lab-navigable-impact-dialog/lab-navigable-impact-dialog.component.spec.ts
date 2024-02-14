import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabNavigableImpactDialogComponent} from './lab-navigable-impact-dialog.component';

describe('LabNavigableImpactDialogComponent', () => {
  let component: LabNavigableImpactDialogComponent;
  let fixture: ComponentFixture<LabNavigableImpactDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabNavigableImpactDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabNavigableImpactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
