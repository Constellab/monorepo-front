import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaSelectServerCloudDialogComponent} from './ca-select-server-cloud-dialog.component';

describe('CaSelectServerCloudDialogComponent', () => {
  let component: CaSelectServerCloudDialogComponent;
  let fixture: ComponentFixture<CaSelectServerCloudDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaSelectServerCloudDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaSelectServerCloudDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
