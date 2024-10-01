import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaLabStatusDialogComponent} from './ca-lab-status-dialog.component';

describe('LabStatusDialogComponent', () => {
  let component: CaLabStatusDialogComponent;
  let fixture: ComponentFixture<CaLabStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaLabStatusDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaLabStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
