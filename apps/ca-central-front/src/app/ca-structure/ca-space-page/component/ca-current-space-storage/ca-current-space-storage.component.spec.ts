import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaCurrentSpaceStorageComponent } from './ca-current-space-storage.component';

describe('CaCurrentSpaceStorageUsageComponent', () => {
  let component: CaCurrentSpaceStorageComponent;
  let fixture: ComponentFixture<CaCurrentSpaceStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaCurrentSpaceStorageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaCurrentSpaceStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
