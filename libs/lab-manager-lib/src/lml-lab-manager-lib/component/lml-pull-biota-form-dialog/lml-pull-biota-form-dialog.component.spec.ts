import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlPullBiotaFormDialogComponent } from './lml-pull-biota-form-dialog.component';

describe('CaLabPullBiotaFormDialogComponent', () => {
  let component: LmlPullBiotaFormDialogComponent;
  let fixture: ComponentFixture<LmlPullBiotaFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlPullBiotaFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LmlPullBiotaFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
