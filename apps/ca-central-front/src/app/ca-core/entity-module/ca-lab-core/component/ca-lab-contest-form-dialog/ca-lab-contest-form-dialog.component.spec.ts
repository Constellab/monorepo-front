import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaLabContestFormDialogComponent} from './ca-lab-contest-form-dialog.component';

describe('CaLabConstestFormDialogComponent', () => {
  let component: CaLabContestFormDialogComponent;
  let fixture: ComponentFixture<CaLabContestFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabContestFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabContestFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
