import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeTimestampConfigDialogComponent } from './te-timestamp-config-dialog.component';

describe('TeTimestampConfigDialogComponent', () => {
  let component: TeTimestampConfigDialogComponent;
  let fixture: ComponentFixture<TeTimestampConfigDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTimestampConfigDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeTimestampConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
