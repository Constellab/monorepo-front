import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaServerStandardFormDialogComponent} from './ca-server-standard-form-dialog.component';

describe('CaServerStandardFormDialogComponent', () => {
  let component: CaServerStandardFormDialogComponent;
  let fixture: ComponentFixture<CaServerStandardFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaServerStandardFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaServerStandardFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
