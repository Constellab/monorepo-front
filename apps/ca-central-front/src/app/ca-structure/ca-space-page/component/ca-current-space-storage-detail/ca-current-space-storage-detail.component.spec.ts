import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaCurrentSpaceStorageDetailComponent} from './ca-current-space-storage-detail.component';

describe('CaCurrentSpaceStorageDetailComponent', () => {
  let component: CaCurrentSpaceStorageDetailComponent;
  let fixture: ComponentFixture<CaCurrentSpaceStorageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaCurrentSpaceStorageDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaCurrentSpaceStorageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
