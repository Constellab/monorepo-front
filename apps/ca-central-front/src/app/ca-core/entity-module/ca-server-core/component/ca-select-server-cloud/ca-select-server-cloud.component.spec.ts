import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaSelectServerCloudComponent } from './ca-select-server-cloud.component';

describe('CaSelectServerCloudComponent', () => {
  let component: CaSelectServerCloudComponent;
  let fixture: ComponentFixture<CaSelectServerCloudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaSelectServerCloudComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaSelectServerCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
