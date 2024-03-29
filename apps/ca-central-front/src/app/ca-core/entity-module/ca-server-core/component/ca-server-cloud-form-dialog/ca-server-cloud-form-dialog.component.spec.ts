import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaServerCloudFormDialogComponent} from './ca-server-cloud-form-dialog.component';

describe('ServerInfoFormDialogComponent', () => {
  let component: CaServerCloudFormDialogComponent;
  let fixture: ComponentFixture<CaServerCloudFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaServerCloudFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaServerCloudFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
