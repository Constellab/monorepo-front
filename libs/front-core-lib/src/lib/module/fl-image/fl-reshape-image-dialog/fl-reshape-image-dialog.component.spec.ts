import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {FlReshapeImageDialogComponent} from './fl-reshape-image-dialog.component';

describe('FlReshapeImageDialogComponent', () => {
  let component: FlReshapeImageDialogComponent;
  let fixture: ComponentFixture<FlReshapeImageDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FlReshapeImageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlReshapeImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
