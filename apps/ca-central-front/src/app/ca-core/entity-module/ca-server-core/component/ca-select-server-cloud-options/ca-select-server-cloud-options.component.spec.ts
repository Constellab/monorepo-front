import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaSelectServerCloudOptionsComponent} from './ca-select-server-cloud-options.component';

describe('ServerInfoSelectOptionsComponent', () => {
  let component: CaSelectServerCloudOptionsComponent;
  let fixture: ComponentFixture<CaSelectServerCloudOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaSelectServerCloudOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaSelectServerCloudOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
